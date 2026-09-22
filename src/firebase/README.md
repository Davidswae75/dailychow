# Firebase Backend Structure (Cloud Functions 2nd gen + TypeScript, Modular SDK)

This document describes the folder structure, what every folder and file is **for**, and the implementation patterns for a Firebase backend built with **Cloud Functions (2nd gen)**, **TypeScript**, and the **modular Admin SDK**.

For every folder you will find:

- **What it is** – one-sentence purpose
- **Files** – each file, what it owns, and example contents
- **Belongs / Does NOT belong** – concrete examples, including *where the misplaced code should go instead*
- **Working code** – copy-paste-ready examples

---

## 0. What "modular" means here

Everything is imported from **subpath entry points**. Nothing uses the old namespaced style (`admin.firestore()`, `functions.https.onCall`, `admin.initializeApp()`).

### Import cheat sheet

| You need | Modular import |
|---|---|
| Initialize / get the Admin app | `import { initializeApp, getApp, getApps } from 'firebase-admin/app'` |
| Firestore | `import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore'` |
| Auth (admin) | `import { getAuth } from 'firebase-admin/auth'` |
| Cloud Storage | `import { getStorage } from 'firebase-admin/storage'` |
| Push notifications (FCM) | `import { getMessaging } from 'firebase-admin/messaging'` |
| Callable / HTTP functions | `import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https'` |
| Firestore triggers | `import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted, onDocumentWritten } from 'firebase-functions/v2/firestore'` |
| Storage triggers | `import { onObjectFinalized, onObjectDeleted } from 'firebase-functions/v2/storage'` |
| Scheduled functions | `import { onSchedule } from 'firebase-functions/v2/scheduler'` |
| Auth *blocking* functions | `import { beforeUserCreated, beforeUserSignedIn } from 'firebase-functions/v2/identity'` |
| Secrets & params | `import { defineSecret, defineString } from 'firebase-functions/params'` |
| Structured logging | `import { logger } from 'firebase-functions/logger'` |

### Two things worth knowing

1. **Firestore method chaining is still normal in the Admin SDK.** `db.collection('users').doc(uid).get()` is the correct *modular Admin* style. The functional style (`doc(db, 'users', uid)`, `getDoc()`, `setDoc()`) belongs to the **client** web SDK (`firebase/firestore`) — do not mix the two in `functions/`.
2. **In 2nd gen there is no non-blocking "user created" trigger.** `onUserCreated` does not exist in `firebase-functions/v2/identity` (as far as I know — double-check the current docs). Your options are covered in [Section 8.3](#83-srctriggersauth--reacting-to-sign-ups).

---

## 1. Why this structure?

| Folder | Purpose | Benefit |
|---|---|---|
| `src/firebase/` | Creates the Admin SDK clients (`db`, `auth`, `storage`) exactly once | Guarantees the app is initialized before anything uses it |
| `src/config/` | Secrets, params, region, shared function options, constants | One place to change environment-specific values |
| `src/types/` | Shared TypeScript interfaces | Single source of truth for data shapes |
| `src/utils/` | Validators, error helpers, auth guard | Reusable, domain-free helpers |
| `src/services/` | Business rules + Firestore reads/writes | Keeps functions thin and unit-testable |
| `src/api/` | Callable functions (`onCall`) | The frontend's front door |
| `src/triggers/` | Firestore / Auth / Storage / Schedule triggers | Automatic side-effects |
| `src/index.ts` | Re-exports every deployable function | The whole backend surface at a glance |

### Core principle

- `api/` → thin front door: **auth check → validate input → call a service → return a response**
- `services/` → all real work: **business rules + Firestore/Auth/Storage operations**
- `triggers/` → automatic reactions only: **read the event → call a service**
- `types/`, `config/`, `utils/`, `firebase/` → shared foundations

### Dependency rules (who may import whom)

```
index.ts ──► api/*        ──► services/* ──► firebase/*
         └─► triggers/*   ──► services/* ──► types/*, config/, utils/
```

- `api/` and `triggers/` may import `services/`, `types/`, `config/`, `utils/`
- `services/` may import `firebase/`, `types/`, `config/`, `utils/` — **never** `api/` or `triggers/`
- `types/` imports nothing
- Only `index.ts` imports `api/` and `triggers/`

If you ever need `services/` to import from `api/`, the logic is in the wrong place.

---

## 2. Folder structure

```
functions/
├── src/
│   ├── index.ts                      # Re-exports every deployable function. Nothing else.
│   │
│   ├── firebase/
│   │   └── admin.ts                  # initializeApp once + export db, auth, storage
│   │
│   ├── config/
│   │   └── index.ts                  # REGION, secrets, params, CALLABLE_OPTIONS, APP_CONFIG
│   │
│   ├── types/
│   │   ├── index.ts                  # Barrel: export * from './user'; export * from './post'
│   │   ├── user.ts                   # User, CreateUserRequest, UpdateUserRequest
│   │   └── post.ts                   # Post, CreatePostRequest, PostWithAuthor
│   │
│   ├── utils/
│   │   ├── auth.ts                   # requireAuth(request)
│   │   ├── errors.ts                 # AppError, handleError()
│   │   └── validators.ts             # validateRequired(), validateStringLength()
│   │
│   ├── services/
│   │   ├── user.service.ts           # User business logic + Firestore access
│   │   └── post.service.ts           # Post business logic + Firestore access
│   │
│   ├── api/
│   │   ├── users.ts                  # Callables: createUserProfile, getUserProfile, updateUserProfile
│   │   └── posts.ts                  # Callables: createPost, getPosts
│   │
│   └── triggers/
│       ├── auth/
│       │   └── onUserCreate.ts       # Runs when a new Firebase Auth user is created
│       ├── firestore/
│       │   └── onPostCreate.ts       # Runs when a document in posts/{postId} is created
│       ├── scheduler/                # (add when needed) cron-style jobs
│       │   └── dailyCleanup.ts
│       └── storage/                  # (add when needed) file upload/delete reactions
│           └── onImageUpload.ts
│
├── package.json                      # main: "lib/index.js"
├── tsconfig.json                     # outDir: "lib"
├── .env                              # Local params (defineString). Never commit.
└── .secret.local                     # Local secret values for the emulator. Never commit.
```

> **Don't name a source folder `lib/`.** `firebase init functions` compiles TypeScript into `functions/lib/` (that is `main` in `package.json`), so a `src/lib/` would end up at `lib/lib/` and cause confusion. That's why the client folder is called `src/firebase/`.

### Root-level files

| File | What it is for | Example |
|---|---|---|
| `package.json` | Dependencies and scripts; `main` points to the compiled entry | `"main": "lib/index.js"`, `"build": "tsc"` |
| `tsconfig.json` | Compiler settings | `"strict": true`, `"outDir": "lib"` |
| `.env` | Local values for `defineString()` params | `APP_ENV=development` |
| `.secret.local` | Local values for `defineSecret()` secrets when using the emulator | `STRIPE_SECRET_KEY=sk_test_...` |
| `.gitignore` | Must list `.env`, `.secret.local`, `lib/`, `node_modules/` | — |

---

## 3. `src/index.ts` — the only file Firebase scans

**What it is:** The single entry point. Firebase deploys every **named export** of this file as a Cloud Function.

**Files:** just this one.

**Belongs here**

- ✅ `export { createPost, getPosts } from './api/posts';`
- ✅ `export { onPostCreate } from './triggers/firestore/onPostCreate';`

**Does NOT belong here**

- ❌ `initializeApp()` → `src/firebase/admin.ts`
- ❌ `const db = getFirestore()` → `src/firebase/admin.ts`
- ❌ `if (content.length > 2000) …` → `src/utils/validators.ts`
- ❌ `db.collection('posts').add(...)` → `src/services/post.service.ts`
- ❌ Constants like `const PAGE_SIZE = 20` → `src/config/index.ts`

**How it operates**

1. `firebase deploy --only functions` loads this file.
2. Every named export becomes a deployed function, **using the export name as the function name**.
3. That means `export { createPost }` deploys a function called `createPost`, and you can deploy it alone with `firebase deploy --only functions:createPost`.

```ts
// src/index.ts

// === Callable functions (called by the frontend) ===
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from './api/users';

export { createPost, getPosts } from './api/posts';

// === Triggers (run automatically on events) ===
export { onUserCreate } from './triggers/auth/onUserCreate';
export { onPostCreate } from './triggers/firestore/onPostCreate';
export { dailyCleanup } from './triggers/scheduler/dailyCleanup';
```

> Admin SDK initialization no longer lives here. It moved to `src/firebase/admin.ts` so it is guaranteed to run before any file that needs `db` — regardless of import order.

---

## 4. `src/firebase/` — Admin SDK clients

**What it is:** The one place where the Admin app is initialized and where `db`, `auth`, and `storage` are created.

**Files**

| File | What it owns | Example contents |
|---|---|---|
| `admin.ts` | App init + exported service clients | `export const db = getFirestore(app)` |
| *(future)* `messaging.ts` | Only if you want a separate FCM client | `export const messaging = getMessaging(app)` |

**Belongs here**

- ✅ `initializeApp()` guarded by `getApps()`
- ✅ `export const db = getFirestore(app)`
- ✅ One-time Firestore settings such as `ignoreUndefinedProperties`

**Does NOT belong here**

- ❌ `db.collection('users').doc(uid).get()` → `src/services/user.service.ts`
- ❌ Secrets → `src/config/index.ts`

**How it operates**

Any file that imports `db` from here triggers initialization the first time (module caching guarantees it runs once). Services import `db`; they never call `initializeApp()` themselves.

```ts
// src/firebase/admin.ts
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize exactly once (safe under the emulator and on cold starts)
const app = getApps().length > 0 ? getApp() : initializeApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Must run before the first Firestore operation. Prevents
// "Cannot use undefined as a Firestore value" on optional fields.
db.settings({ ignoreUndefinedProperties: true });
```

---

## 5. `src/config/` — configuration, secrets, shared function options

**What it is:** Single source of truth for anything that can change between environments (dev / staging / production) or that several files share.

**Files**

| File | What it owns | Example contents |
|---|---|---|
| `index.ts` | Region, secrets, params, shared function options, app constants | `REGION`, `STRIPE_SECRET_KEY`, `CALLABLE_OPTIONS`, `APP_CONFIG` |
| *(future)* `email.ts` | A larger config group if `index.ts` grows | Email templates config, sender addresses |

**Belongs here**

- ✅ `defineSecret('STRIPE_SECRET_KEY')`
- ✅ `defineString('APP_ENV', { default: 'development' })`
- ✅ `export const REGION = 'us-central1'`
- ✅ `APP_CONFIG.maxPostsPerUser = 100`
- ✅ `CALLABLE_OPTIONS` — options reused by every `onCall`

**Does NOT belong here**

- ❌ `function calculateDiscount(price)` → `src/services/`
- ❌ `getFirestore()` → `src/firebase/admin.ts`
- ❌ A constant used in exactly one file (keep it local to that file)

**How it operates**

- Import values wherever needed; avoid reading `process.env` directly in the codebase.
- Secrets are stored in Secret Manager: `firebase functions:secrets:set STRIPE_SECRET_KEY`.
- A function only receives a secret if you **bind it** in that function's options (`secrets: [STRIPE_SECRET_KEY]`). Read it with `.value()` *inside* the handler, never at module top level.
- For the emulator, put secret values in `functions/.secret.local` and params in `functions/.env`.

```ts
// src/config/index.ts
import { defineSecret, defineString } from 'firebase-functions/params';
import type { CallableOptions } from 'firebase-functions/v2/https';

// ---- Region -------------------------------------------------------------
// If you use Firestore triggers, pick a region compatible with your
// Firestore database location.
export const REGION = 'us-central1';

// ---- Secrets & params ---------------------------------------------------
export const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
export const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');
export const APP_ENV = defineString('APP_ENV', { default: 'development' });

// ---- Shared options for every callable function -------------------------
export const CALLABLE_OPTIONS: CallableOptions = {
  region: REGION,
  maxInstances: 10,
  // enforceAppCheck: true,   // turn on once App Check is set up in the client
};

// ---- App-wide constants -------------------------------------------------
export const APP_CONFIG = {
  maxPostsPerUser: 100,
  defaultPageSize: 20,
  maxPageSize: 50,
  maxImageSizeMB: 5,
};
```

Binding a secret to a function that needs it:

```ts
// Example: a callable that calls Stripe
import { onCall } from 'firebase-functions/v2/https';
import { CALLABLE_OPTIONS, STRIPE_SECRET_KEY } from '../config';

export const createCheckoutSession = onCall(
  { ...CALLABLE_OPTIONS, secrets: [STRIPE_SECRET_KEY] },
  async (request) => {
    const key = STRIPE_SECRET_KEY.value(); // read at runtime, inside the handler
    // ...
  }
);
```

---

## 6. `src/types/` — pure TypeScript data contracts

**What it is:** The exact shape of every domain object and every request the frontend may send. **Zero runtime logic.**

**Files**

| File | What it owns | Example contents |
|---|---|---|
| `user.ts` | Everything about the `User` domain | `User`, `CreateUserRequest`, `UpdateUserRequest` |
| `post.ts` | Everything about the `Post` domain | `Post`, `CreatePostRequest`, `PostWithAuthor` |
| `index.ts` | Barrel re-export | `export * from './user'; export * from './post';` |
| *(future)* `comment.ts` | A new domain | `Comment`, `AddCommentRequest` |

**Belongs here**

- ✅ `export interface Post { id: string; content: string; … }`
- ✅ `export type PostStatus = 'draft' | 'published'`
- ✅ `export interface CreatePostRequest { content: string; imageUrl?: string }`

**Does NOT belong here**

- ❌ `export const DEFAULT_LIMIT = 20` → `src/config/`
- ❌ `function isValidPost(p: Post)` → `src/utils/validators.ts`
- ❌ Zod schemas (they are runtime code) → `src/utils/validators.ts`

**How it operates**

Imported by `api/`, `services/`, and sometimes `triggers/`. Use `import type { … }` so nothing is emitted at runtime. Changing a field means editing one file.

```ts
// src/types/user.ts
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  postsCount: number;      // maintained by the onPostCreate trigger
  createdAt: string;       // ISO-8601
  updatedAt: string;
}

export interface CreateUserRequest {
  displayName?: string;
  photoURL?: string;
}

export interface UpdateUserRequest {
  displayName?: string;
  photoURL?: string;
}
```

```ts
// src/types/post.ts
export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string | null;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

/** Richer type used when a response joins author data onto a post */
export interface PostWithAuthor extends Post {
  author: {
    displayName: string | null;
    photoURL: string | null;
  };
}
```

```ts
// src/types/index.ts
export * from './user';
export * from './post';
```

---

## 7. `src/utils/` — shared, domain-free helpers

**What it is:** Small, reusable helpers that know nothing about users or posts.

**Files**

| File | What it owns | Example contents |
|---|---|---|
| `auth.ts` | Authentication guard for callables | `requireAuth(request)` |
| `errors.ts` | Error classes and mapping to `HttpsError` | `AppError`, `handleError(error)` |
| `validators.ts` | Input validation helpers | `validateRequired()`, `validateStringLength()` |
| *(future)* `dates.ts` | Date helpers | `startOfDayUTC(date)` |
| *(future)* `pagination.ts` | Cursor/limit helpers | `clampLimit(limit, max)` |

**Belongs here**

- ✅ `validateStringLength(value, 'content', 1, 2000)`
- ✅ `requireAuth(request)`
- ✅ `class AppError extends Error`

**Does NOT belong here**

- ❌ `getPostsByUser()` (touches Firestore + domain) → `src/services/post.service.ts`
- ❌ `if (postCount >= 100)` (business rule) → `src/services/post.service.ts`
- ❌ Anything that imports `db`

```ts
// src/utils/errors.ts
import { HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';

/** Error codes a service is allowed to throw. Subset of HttpsError codes. */
export type AppErrorCode =
  | 'invalid-argument'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'failed-precondition';

/** Thrown by services. Knows nothing about HTTP or Firebase Functions. */
export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Used in the `catch` of every callable.
 * Converts whatever was thrown into a clean HttpsError for the client.
 */
export function handleError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred'
): never {
  if (error instanceof HttpsError) throw error;
  if (error instanceof AppError) throw new HttpsError(error.code, error.message);

  logger.error('Unexpected error', error);
  throw new HttpsError('internal', fallbackMessage);
}
```

```ts
// src/utils/auth.ts
import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';

/** Returns request.auth or throws `unauthenticated`. */
export function requireAuth(
  request: CallableRequest<unknown>
): NonNullable<CallableRequest['auth']> {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in');
  }
  return request.auth;
}
```

```ts
// src/utils/validators.ts
import { HttpsError } from 'firebase-functions/v2/https';

export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new HttpsError('invalid-argument', `${fieldName} is required`);
  }
}

export function validateStringLength(
  value: unknown,
  fieldName: string,
  min: number,
  max: number
): asserts value is string {
  if (typeof value !== 'string') {
    throw new HttpsError('invalid-argument', `${fieldName} must be a string`);
  }
  if (value.length < min || value.length > max) {
    throw new HttpsError(
      'invalid-argument',
      `${fieldName} must be between ${min} and ${max} characters`
    );
  }
}
```

---

## 8. Layers that do the work

### 8.1 `src/services/` — business logic & Firestore operations

**What it is:** Where the real work happens. Functions receive plain data and return plain data (or throw an `AppError`). No `onCall`, no `request`, no `HttpsError`.

**Files**

| File | What it owns | Example functions |
|---|---|---|
| `user.service.ts` | User rules and user data access | `createUserProfile`, `getUserById`, `updateUserProfile`, `incrementPostsCount` |
| `post.service.ts` | Post rules and post data access | `createPost`, `getPostsByUser` |
| *(future)* `email.service.ts` | Third-party email calls | `sendWelcomeEmail(user)` |
| *(future)* `payment.service.ts` | Stripe logic | `createCheckoutSession(uid, priceId)` |

**Naming:** one file per domain noun, `<noun>.service.ts`.

**Belongs here**

- ✅ `db.collection('posts').add(postData)`
- ✅ "A user may have at most 100 posts" (business rule)
- ✅ Calling Stripe / SendGrid as part of a domain operation
- ✅ Using `getAuth()`, `getStorage()`, `FieldValue.increment()`

**Does NOT belong here**

- ❌ `onCall(...)` / `onDocumentCreated(...)` → `src/api/` or `src/triggers/`
- ❌ `if (!request.auth)` → `src/api/` (via `requireAuth`)
- ❌ `throw new HttpsError(...)` → throw `AppError` here; `handleError()` in `api/` converts it
- ❌ Imports from `../api/` or `../triggers/`

**How it operates**

`api/` and `triggers/` both call these functions. Because they are plain TypeScript, you can unit-test them without any Firebase Functions machinery.

```ts
// src/services/user.service.ts
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../firebase/admin';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { AppError } from '../utils/errors';

const users = db.collection('users');

export async function createUserProfile(
  uid: string,
  email: string,
  data: CreateUserRequest
): Promise<User> {
  const now = new Date().toISOString();

  const user: User = {
    uid,
    email,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    postsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await users.doc(uid).set(user);
  return user;
}

export async function getUserById(uid: string): Promise<User | null> {
  const snap = await users.doc(uid).get();
  return snap.exists ? (snap.data() as User) : null;
}

export async function updateUserProfile(
  uid: string,
  data: UpdateUserRequest
): Promise<User> {
  const ref = users.doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new AppError('not-found', 'User not found');
  }

  await ref.update({ ...data, updatedAt: new Date().toISOString() });

  return (await ref.get()).data() as User;
}

/** Used by the onPostCreate trigger to keep the counter in sync. */
export async function incrementPostsCount(uid: string, by = 1): Promise<void> {
  await users.doc(uid).update({
    postsCount: FieldValue.increment(by),
    updatedAt: new Date().toISOString(),
  });
}
```

```ts
// src/services/post.service.ts
import { db } from '../firebase/admin';
import { APP_CONFIG } from '../config';
import type { Post, CreatePostRequest } from '../types';
import { AppError } from '../utils/errors';

const posts = db.collection('posts');

export async function createPost(
  authorId: string,
  data: CreatePostRequest
): Promise<Post> {
  // Business rule: a user may have at most N posts.
  // .count() is a Firestore aggregation query (cheap, no documents downloaded).
  const countSnap = await posts.where('authorId', '==', authorId).count().get();
  if (countSnap.data().count >= APP_CONFIG.maxPostsPerUser) {
    throw new AppError(
      'failed-precondition',
      `Post limit of ${APP_CONFIG.maxPostsPerUser} reached`
    );
  }

  const now = new Date().toISOString();
  const postData: Omit<Post, 'id'> = {
    authorId,
    content: data.content.trim(),
    imageUrl: data.imageUrl ?? null,
    likesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await posts.add(postData);
  return { id: docRef.id, ...postData };
}

export async function getPostsByUser(
  userId: string,
  limit: number = APP_CONFIG.defaultPageSize
): Promise<Post[]> {
  // Needs a composite index: authorId (asc) + createdAt (desc).
  // Firestore prints a link to create it the first time this query runs.
  const snapshot = await posts
    .where('authorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Post, 'id'>),
  }));
}
```

---

### 8.2 `src/api/` — thin callable functions (the frontend's entry point)

**What it is:** The functions the client calls with `httpsCallable`. They must stay thin.

**Files**

| File | What it owns | Example functions |
|---|---|---|
| `users.ts` | Callables about user profiles | `createUserProfile`, `getUserProfile`, `updateUserProfile` |
| `posts.ts` | Callables about posts | `createPost`, `getPosts` |
| *(future)* `comments.ts` | Callables about comments | `addComment`, `deleteComment` |

**Naming:** one file per domain noun, plural (`users.ts`). The **export name is the deployed function name**, so choose names the frontend can read clearly (`createPost`, not `cp1`).

**Belongs here**

- ✅ `const { uid } = requireAuth(request)`
- ✅ `validateStringLength(request.data?.content, 'content', 1, 2000)`
- ✅ `const post = await postService.createPost(uid, request.data)`
- ✅ `catch (error) { handleError(error) }`

**Does NOT belong here**

- ❌ `db.collection('posts').add(...)` → `src/services/post.service.ts`
- ❌ `if (postCount >= 100) …` → `src/services/post.service.ts`
- ❌ Building a `PostWithAuthor` from two collections → `src/services/post.service.ts`

**How it operates**

1. Client calls the function.
2. `requireAuth()` verifies the user is signed in.
3. Validators check the payload.
4. A service does the work (and may throw `AppError`).
5. `handleError()` turns any failure into a clean `HttpsError`; success returns a plain object.

```ts
// src/api/users.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { CALLABLE_OPTIONS } from '../config';
import * as userService from '../services/user.service';
import type { CreateUserRequest, UpdateUserRequest } from '../types';
import { requireAuth } from '../utils/auth';
import { handleError } from '../utils/errors';

// NOTE: if you also create profiles in the onUserCreate trigger, you likely
// don't need this callable. `set()` overwrites the whole document, so pick
// one path or make the service idempotent.
export const createUserProfile = onCall<CreateUserRequest>(
  CALLABLE_OPTIONS,
  async (request) => {
    const { uid, token } = requireAuth(request);
    try {
      const user = await userService.createUserProfile(
        uid,
        token.email ?? '',
        request.data ?? {}
      );
      return { success: true, user };
    } catch (error) {
      handleError(error, 'Failed to create user profile');
    }
  }
);

export const getUserProfile = onCall(CALLABLE_OPTIONS, async (request) => {
  const { uid: callerUid } = requireAuth(request);
  const uid = (request.data?.uid as string | undefined) ?? callerUid;

  try {
    const user = await userService.getUserById(uid);
    if (!user) throw new HttpsError('not-found', 'User not found');
    return { user };
  } catch (error) {
    handleError(error);
  }
});

export const updateUserProfile = onCall<UpdateUserRequest>(
  CALLABLE_OPTIONS,
  async (request) => {
    const { uid } = requireAuth(request);
    try {
      const user = await userService.updateUserProfile(uid, request.data ?? {});
      return { success: true, user };
    } catch (error) {
      handleError(error, 'Failed to update profile');
    }
  }
);
```

```ts
// src/api/posts.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { APP_CONFIG, CALLABLE_OPTIONS } from '../config';
import * as postService from '../services/post.service';
import type { CreatePostRequest } from '../types';
import { requireAuth } from '../utils/auth';
import { handleError } from '../utils/errors';
import { validateRequired, validateStringLength } from '../utils/validators';

export const createPost = onCall<CreatePostRequest>(
  CALLABLE_OPTIONS,
  async (request) => {
    const { uid } = requireAuth(request);

    validateRequired(request.data?.content, 'content');
    validateStringLength(request.data.content, 'content', 1, 2000);

    try {
      const post = await postService.createPost(uid, request.data);
      return { success: true, post };
    } catch (error) {
      handleError(error, 'Failed to create post');
    }
  }
);

export const getPosts = onCall(CALLABLE_OPTIONS, async (request) => {
  requireAuth(request);

  const userId = request.data?.userId as string | undefined;
  if (!userId) {
    throw new HttpsError('invalid-argument', 'userId is required');
  }

  const requested = Number(request.data?.limit) || APP_CONFIG.defaultPageSize;
  const limit = Math.min(requested, APP_CONFIG.maxPageSize);

  try {
    const posts = await postService.getPostsByUser(userId, limit);
    return { posts };
  } catch (error) {
    handleError(error);
  }
});
```

---

### 8.3 `src/triggers/` — automatic background reactions

**What it is:** Code that runs when something *happens* (a document is created, a file is uploaded, a clock strikes 3 a.m.). **The frontend never calls these.** They are organized by the *source of the event*.

**Sub-folders and files**

| Folder / file | Fires when | Example |
|---|---|---|
| `auth/onUserCreate.ts` | A new Firebase Auth user is created | Create the `users/{uid}` profile document |
| `firestore/onPostCreate.ts` | A document is created at `posts/{postId}` | Increment `users/{uid}.postsCount` |
| *(future)* `firestore/onPostDelete.ts` | A post document is deleted | Decrement the counter, delete its image |
| `scheduler/dailyCleanup.ts` | A cron schedule fires | Delete drafts older than 30 days |
| `storage/onImageUpload.ts` | A file lands in Cloud Storage | Generate a thumbnail |

**Naming:** one file per trigger, named `on<Event>.ts` for event-driven triggers or by the job for schedules (`dailyCleanup.ts`). The export name becomes the deployed function name.

**Belongs here**

- ✅ Reading `event.data`, `event.params`
- ✅ `await userService.incrementPostsCount(post.authorId)`
- ✅ Logging with `logger.info(...)`

**Does NOT belong here**

- ❌ Logic the frontend needs to invoke on demand → `src/api/`
- ❌ Reusable business rules → `src/services/`
- ❌ `return { success: true }` to a client (there is no client)

**How it operates**

1. Firebase detects a matching event.
2. Your function receives an event object.
3. You call a service.
4. The function finishes. Nothing is returned to any caller.

> Triggers are delivered **at least once**, so the same event can occasionally run twice. Make side-effects idempotent where it matters (for example, store `event.id` and skip if already processed before incrementing a counter).

#### `triggers/auth/` — reacting to sign-ups

There are two ways to run code on user creation:

- **v1 non-blocking `onCreate` (below)** — runs *after* the user exists. This is the direct replacement for the old `onUserCreated` and the option used in this document. v1 and v2 functions can live side by side in one codebase.
- **v2 blocking `beforeUserCreated`** — runs *before* the account is created and can reject the sign-up. It needs **Google Cloud Identity Platform**, and it blocks sign-up until it returns, so keep it fast. Use it for allow-lists or custom claims, not for slow side-effects.

```ts
// src/triggers/auth/onUserCreate.ts
import { auth as authV1 } from 'firebase-functions/v1';
import { logger } from 'firebase-functions/logger';
import * as userService from '../../services/user.service';

export const onUserCreate = authV1.user().onCreate(async (user) => {
  try {
    await userService.createUserProfile(user.uid, user.email ?? '', {
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
    });
    logger.info('User profile created', { uid: user.uid });
  } catch (error) {
    logger.error('Failed to create profile on signup', { uid: user.uid, error });
    // Don't re-throw unless you have enabled retries for this function
  }
});
```

Blocking alternative (v2):

```ts
// src/triggers/auth/beforeUserCreate.ts  (only if you use Identity Platform)
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import { REGION } from '../../config';

export const beforeUserCreate = beforeUserCreated({ region: REGION }, async (event) => {
  const email = event.data?.email ?? '';
  // Example rule: reject sign-ups from a blocked domain
  // if (email.endsWith('@blocked.example')) throw new HttpsError('permission-denied', '...');
});
```

#### `triggers/firestore/` — reacting to data changes

```ts
// src/triggers/firestore/onPostCreate.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/logger';
import { REGION } from '../../config';
import * as userService from '../../services/user.service';

export const onPostCreate = onDocumentCreated(
  { document: 'posts/{postId}', region: REGION },
  async (event) => {
    const post = event.data?.data();
    if (!post) return;

    logger.info('Post created', {
      postId: event.params.postId,
      authorId: post.authorId,
    });

    // Side-effect lives in a service, so the trigger stays thin
    await userService.incrementPostsCount(post.authorId);
  }
);
```

#### `triggers/scheduler/` — cron-style jobs *(add when needed)*

```ts
// src/triggers/scheduler/dailyCleanup.ts
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/logger';
import { REGION } from '../../config';
// import * as postService from '../../services/post.service';

export const dailyCleanup = onSchedule(
  { schedule: 'every day 03:00', timeZone: 'UTC', region: REGION },
  async () => {
    logger.info('Running daily cleanup');
    // await postService.deleteStaleDrafts(30);   // a service does the real work
  }
);
```

#### `triggers/storage/` — reacting to file uploads *(add when needed)*

```ts
// src/triggers/storage/onImageUpload.ts
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { logger } from 'firebase-functions/logger';
import { REGION } from '../../config';

export const onImageUpload = onObjectFinalized({ region: REGION }, async (event) => {
  const { name, contentType, bucket } = event.data;
  if (!contentType?.startsWith('image/')) return;

  logger.info('Image uploaded', { bucket, name });
  // await imageService.generateThumbnail(bucket, name);
});
```

---

## 9. Worked example: "a user creates a post"

**Client (also modular — Firebase web SDK v9+):**

```ts
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

const functions = getFunctions(app, 'us-central1');
const createPost = httpsCallable<
  { content: string; imageUrl?: string },
  { success: boolean; post: { id: string } }
>(functions, 'createPost');

const { data } = await createPost({ content: 'Hello world' });
```

**Backend flow:**

| Step | File | What happens |
|---|---|---|
| 1 | `src/index.ts` | Exposes `createPost` to Firebase |
| 2 | `src/api/posts.ts` | `requireAuth()` → `validateStringLength()` → calls the service |
| 3 | `src/utils/auth.ts`, `validators.ts` | Reject anonymous users and bad payloads |
| 4 | `src/services/post.service.ts` | Checks the 100-post limit, writes `posts/{id}` via `db` |
| 5 | `src/firebase/admin.ts` | Supplies the initialized `db` |
| 6 | `src/api/posts.ts` | Returns `{ success: true, post }` to the client |
| 7 | *(Firestore emits an event)* | — |
| 8 | `src/triggers/firestore/onPostCreate.ts` | Fires automatically, calls `userService.incrementPostsCount()` |
| 9 | `src/services/user.service.ts` | Increments `users/{uid}.postsCount` |

---

## 10. "Where does this go?" quick lookup

| I want to… | Put it in | Why |
|---|---|---|
| Reject requests from signed-out users | `utils/auth.ts` → called from `api/` | Reusable guard, checked at the front door |
| Check a comment is 1–500 characters | `utils/validators.ts` → called from `api/` | Input validation, not a business rule |
| Enforce "max 100 posts per user" | `services/post.service.ts` | Business rule |
| Add a new Firestore field to users | `types/user.ts`, then `services/user.service.ts` | Shape first, then behavior |
| Send a welcome email on signup | `services/email.service.ts`, called by `triggers/auth/onUserCreate.ts` | Trigger is the *when*, service is the *how* |
| Change the default page size | `config/index.ts` | App-wide constant |
| Add a Stripe API key | `config/index.ts` (`defineSecret`) + bind in the function's options | Secrets are centralized and bound per function |
| Run a job every night | `triggers/scheduler/<jobName>.ts` | Time-based event |
| Make a thumbnail after upload | `triggers/storage/onImageUpload.ts` → `services/image.service.ts` | Storage event + service |
| Delete a user's data when they delete their account | `triggers/auth/…` → `services/user.service.ts` | Event-driven cleanup |
| Expose a brand-new endpoint | `api/<noun>.ts`, then export from `index.ts` | Front door + registration |

---

## 11. Setup instructions

### 1. Initialize the project

```bash
firebase init functions
```

Choose **TypeScript**, **ESLint** (recommended), and install dependencies.

### 2. Install packages

```bash
cd functions
npm install firebase-admin firebase-functions
npm install -D @types/node
# Optional but recommended for richer validation
npm install zod
```

### 3. Run locally with the emulator

```bash
firebase emulators:start --only functions,firestore,auth
```

Local params go in `functions/.env`; local secret values go in `functions/.secret.local`.

### 4. Set production secrets

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
```

### 5. Deploy

```bash
firebase deploy --only functions                 # everything
firebase deploy --only functions:createPost      # one function
```

---

## 12. Best practices

1. **Keep callables thin** — every meaningful line of logic lives in `services/`.
2. Prefer **`onCall`** over `onRequest` for authenticated client operations (auth and payload parsing are handled for you).
3. **Throw `AppError` from services, convert with `handleError()` in `api/`** — services stay free of HTTP concerns.
4. Validate input in the API layer (or with Zod) *before* calling a service.
5. Use the interfaces from `src/types/` everywhere, with `import type`.
6. **Initialize the Admin SDK in one place** (`src/firebase/admin.ts`); services import `db`, they never initialize.
7. Use **`logger`** from `firebase-functions/logger` instead of `console.*`, and never log secrets or personal data.
8. Read secrets with `.value()` **inside handlers only**, and bind them via `secrets: [...]`.
9. Set `region` (and `maxInstances`) via shared options in `config/` so every function is configured consistently.
10. Make trigger side-effects **idempotent** — events can be delivered more than once.
11. Add composite indexes to `firestore.indexes.json` for any query that filters and sorts on different fields.

---

## 13. Alternative: feature-based structure (larger apps)

When the codebase grows, group by domain instead of by technical layer:

```
src/
├── features/
│   ├── users/
│   │   ├── user.types.ts
│   │   ├── user.service.ts
│   │   ├── user.api.ts
│   │   └── user.triggers.ts
│   └── posts/
│       ├── post.types.ts
│       ├── post.service.ts
│       ├── post.api.ts
│       └── post.triggers.ts
├── shared/
│   ├── firebase/
│   ├── config/
│   └── utils/
└── index.ts
```

The same rules apply inside each feature: `*.api.ts` is the front door, `*.service.ts` does the work, `*.triggers.ts` reacts to events, and a feature may import from `shared/` but not from another feature's `api` or `triggers`.

---

## 14. Summary of changes from the previous version

**Modular SDK and function usage**

- Added an **import cheat sheet** covering Admin (`app`, `firestore`, `auth`, `storage`, `messaging`) and Functions (`https`, `firestore`, `storage`, `scheduler`, `identity`, `params`, `logger`) subpaths.
- Moved Admin initialization out of `index.ts` into **`src/firebase/admin.ts`**, which exports `db`, `auth`, and `storage`. Previously, services called `getFirestore()` at import time, which could run before `initializeApp()` depending on import order.
- Every function now takes an **options object** (`region`, `maxInstances`, `secrets`) from `config/`, e.g. `onCall(CALLABLE_OPTIONS, handler)` and `onDocumentCreated({ document, region }, handler)`.
- Replaced `console.*` with modular `logger`.
- Clarified that Firestore method chaining is the correct Admin-side style, and that `doc()` / `setDoc()` belong to the client SDK.

**Corrections**

- `onUserCreated` (used in the previous version) does not exist in `firebase-functions/v2/identity`. Replaced with the v1 `auth.user().onCreate` trigger and documented the v2 blocking alternative.
- `defineSecret()` values are now shown **bound to functions** with `secrets: [...]` and read with `.value()` in the handler.
- Local secrets go in `.secret.local`, not `.env`.
- Added `postsCount` to the `User` type (the trigger was updating a field the type didn't have).
- The `maxPostsPerUser` constant is now actually enforced in `post.service.ts`.

**Descriptions and examples**

- Every folder and file now has: what it is, a table of its files, ✅ *belongs* / ❌ *does not belong* examples (with where the misplaced code should go), and working code.
- Added dependency rules, a root-files table, a worked end-to-end example, and a "Where does this go?" lookup table.
- Added `utils/auth.ts` (`requireAuth`), `AppError` → `HttpsError` mapping, and `scheduler/` and `storage/` trigger folders.