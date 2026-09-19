# Firebase Backend Structure

This document describes the recommended folder structure, file naming, and implementation patterns for a Firebase backend using **Cloud Functions** (2nd gen) with TypeScript.

## Why This Structure?

| Folder          | Purpose                              | Benefit                              |
|-----------------|--------------------------------------|--------------------------------------|
| `src/services/` | Business logic & data operations     | Keeps functions thin & testable      |
| `src/triggers/` | Firestore / Auth / Storage triggers  | Event-driven architecture            |
| `src/api/`      | Callable functions (`onCall`)        | Main entry point for frontend        |
| `src/types/`    | Shared TypeScript interfaces         | Single source of truth               |
| `src/config/`   | Environment, secrets, constants      | Clean configuration management       |
| `src/utils/`    | Helpers, validators, error handling  | Reusable utilities                   |

---

## Recommended Folder Structure

```
functions/
├── src/
│   ├── index.ts
│   │
│   ├── config/
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   └── post.ts
│   │
│   ├── services/
│   │   ├── user.service.ts
│   │   └── post.service.ts
│   │
│   ├── triggers/
│   │   ├── auth/
│   │   │   └── onUserCreate.ts
│   │   └── firestore/
│   │       └── onPostCreate.ts
│   │
│   ├── api/
│   │   ├── index.ts
│   │   ├── users.ts
│   │   └── posts.ts
│   │
│   └── utils/
│       ├── errors.ts
│       └── validators.ts
│
├── package.json
├── tsconfig.json
└── .env (local only)
```

---

## File Examples

### 1. `src/index.ts`

**Purpose**: Main entry point. Only exports functions here. Keep this file clean.

```ts
// src/index.ts
import * as functions from 'firebase-functions/v2';

// === API (Callable Functions) ===
export { createUserProfile, getUserProfile } from './api/users';
export { createPost, getPosts } from './api/posts';

// === Triggers ===
export { onUserCreate } from './triggers/auth/onUserCreate';
export { onPostCreate } from './triggers/firestore/onPostCreate';
```

---

### 2. `src/config/index.ts`

**Purpose**: Central place for Firebase config, secrets, and constants.

```ts
// src/config/index.ts
import { defineSecret } from 'firebase-functions/params';

export const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
export const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');

export const APP_CONFIG = {
  maxPostsPerUser: 100,
  defaultPageSize: 20,
  supportedRegions: ['us-central1', 'europe-west1'],
};
```

---

### 3. `src/types/user.ts`

**Purpose**: Shared types for User domain.

```ts
// src/types/user.ts
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
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

---

### 4. `src/types/post.ts`

```ts
// src/types/post.ts
export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}
```

---

### 5. `src/services/user.service.ts`

**Purpose**: Contains all business logic related to users. This is where the real work happens.

```ts
// src/services/user.service.ts
import { getFirestore } from 'firebase-admin/firestore';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

const db = getFirestore();

export async function createUserProfile(
  uid: string,
  data: CreateUserRequest
): Promise<User> {
  const now = new Date().toISOString();

  const user: User = {
    uid,
    email: '', // Will be populated from auth if needed
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection('users').doc(uid).set(user);
  return user;
}

export async function getUserById(uid: string): Promise<User | null> {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? (doc.data() as User) : null;
}

export async function updateUserProfile(
  uid: string,
  data: UpdateUserRequest
): Promise<User> {
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.collection('users').doc(uid).update(updateData);

  const updated = await getUserById(uid);
  if (!updated) throw new Error('User not found after update');

  return updated;
}
```

---

### 6. `src/services/post.service.ts`

```ts
// src/services/post.service.ts
import { getFirestore } from 'firebase-admin/firestore';
import { Post, CreatePostRequest } from '../types/post';

const db = getFirestore();

export async function createPost(
  authorId: string,
  data: CreatePostRequest
): Promise<Post> {
  const now = new Date().toISOString();

  const postData = {
    authorId,
    content: data.content,
    imageUrl: data.imageUrl ?? null,
    likesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await db.collection('posts').add(postData);

  return {
    id: docRef.id,
    ...postData,
  } as Post;
}

export async function getPostsByUser(userId: string, limit = 20): Promise<Post[]> {
  const snapshot = await db
    .collection('posts')
    .where('authorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
}
```

---

### 7. `src/api/users.ts`

**Purpose**: HTTP-callable functions that the frontend calls. These should be thin wrappers.

```ts
// src/api/users.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createUserProfile, getUserById, updateUserProfile } from '../services/user.service';
import { CreateUserRequest, UpdateUserRequest } from '../types/user';

export const createUserProfile = onCall<CreateUserRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in');
  }

  const uid = request.auth.uid;
  const data = request.data;

  try {
    const user = await createUserProfile(uid, data);
    return { success: true, user };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new HttpsError('internal', 'Failed to create user profile');
  }
});

export const getUserProfile = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in');
  }

  const uid = request.data?.uid || request.auth.uid;

  const user = await getUserById(uid);
  if (!user) {
    throw new HttpsError('not-found', 'User not found');
  }

  return { user };
});

export const updateUserProfile = onCall<UpdateUserRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in');
  }

  try {
    const user = await updateUserProfile(request.auth.uid, request.data);
    return { success: true, user };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to update profile');
  }
});
```

---

### 8. `src/api/posts.ts`

```ts
// src/api/posts.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createPost, getPostsByUser } from '../services/post.service';
import { CreatePostRequest } from '../types/post';

export const createPost = onCall<CreatePostRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in');
  }

  if (!request.data.content || request.data.content.trim().length === 0) {
    throw new HttpsError('invalid-argument', 'Post content is required');
  }

  try {
    const post = await createPost(request.auth.uid, request.data);
    return { success: true, post };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to create post');
  }
});

export const getPosts = onCall(async (request) => {
  const userId = request.data?.userId;
  const limit = request.data?.limit || 20;

  if (!userId) {
    throw new HttpsError('invalid-argument', 'userId is required');
  }

  const posts = await getPostsByUser(userId, limit);
  return { posts };
});
```

---

### 9. `src/triggers/auth/onUserCreate.ts`

**Purpose**: Automatically runs when a new user signs up via Firebase Auth.

```ts
// src/triggers/auth/onUserCreate.ts
import { onUserCreated } from 'firebase-functions/v2/identity';
import { createUserProfile } from '../../services/user.service';

export const onUserCreate = onUserCreated(async (event) => {
  const user = event.data;

  try {
    await createUserProfile(user.uid, {
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
    });

    console.log(`User profile created for ${user.uid}`);
  } catch (error) {
    console.error('Error creating user profile on signup:', error);
  }
});
```

---

### 10. `src/triggers/firestore/onPostCreate.ts`

```ts
// src/triggers/firestore/onPostCreate.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const onPostCreate = onDocumentCreated('posts/{postId}', async (event) => {
  const post = event.data?.data();
  const postId = event.params.postId;

  if (!post) return;

  console.log(`New post created: ${postId} by ${post.authorId}`);

  // Example: Update user's post count
  await admin.firestore()
    .collection('users')
    .doc(post.authorId)
    .update({
      postsCount: admin.firestore.FieldValue.increment(1),
    });
});
```

---

### 11. `src/utils/errors.ts`

```ts
// src/utils/errors.ts
import { HttpsError } from 'firebase-functions/v2/https';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400
  ) {
    super(message);
  }
}

export function handleError(error: unknown): never {
  if (error instanceof HttpsError) {
    throw error;
  }

  console.error('Unexpected error:', error);
  throw new HttpsError('internal', 'An unexpected error occurred');
}
```

---

### 12. `src/utils/validators.ts`

```ts
// src/utils/validators.ts
import { HttpsError } from 'firebase-functions/v2/https';

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new HttpsError('invalid-argument', `${fieldName} is required`);
  }
}

export function validateStringLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value.length < min || value.length > max) {
    throw new HttpsError(
      'invalid-argument',
      `${fieldName} must be between ${min} and ${max} characters`
    );
  }
}
```

---

## Setup Instructions

### 1. Initialize Firebase Functions

```bash
firebase init functions
```

Choose:
- TypeScript
- ESLint (recommended)
- Install dependencies

### 2. Install Required Packages

```bash
cd functions
npm install firebase-admin firebase-functions zod
npm install -D @types/node
```

### 3. Initialize Firebase Admin (in `src/index.ts` or a separate file)

```ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
```

### 4. Deploy

```bash
firebase deploy --only functions
```

---

## Best Practices

1. **Keep functions thin** — Move logic to `services/`
2. **Use `onCall` over `onRequest`** for authenticated operations
3. **Always validate input** in API layer
4. **Use TypeScript interfaces** for request/response shapes
5. **Log important events** but never log sensitive data
6. **Handle errors properly** using `HttpsError`
7. **Use Zod** (optional but recommended) for complex validation

---

## Alternative: Feature-Based Structure (for larger apps)

```
src/
├── features/
│   ├── users/
│   │   ├── user.service.ts
│   │   ├── user.api.ts
│   │   └── user.triggers.ts
│   └── posts/
│       ├── post.service.ts
│       ├── post.api.ts
│       └── post.triggers.ts
├── shared/
│   ├── config/
│   ├── types/
│   └── utils/
└── index.ts
```

---

## Questions?

If you're unsure which structure to use, start with the **domain-based** structure shown above. It's the best balance for most projects.
