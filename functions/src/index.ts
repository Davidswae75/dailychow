// src/index.ts
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

// === API (Callable Functions) ===
export { createUserProfile, getUserProfile, updateUserProfile } from './api/users';
export { createPost, getPosts } from './api/posts';

// === Triggers ===
export { onUserCreate } from './triggers/auth/onUserCreate';
export { onPostCreate } from './triggers/firestore/onPostCreate';
