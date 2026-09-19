// src/config/index.ts
import { defineSecret } from 'firebase-functions/params';

/**
 * Secrets (set via Firebase CLI: firebase functions:secrets:set STRIPE_SECRET_KEY)
 * Access them in functions as: STRIPE_SECRET_KEY.value()
 */
export const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
export const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');

/**
 * Application-wide configuration constants
 */
export const APP_CONFIG = {
  maxPostsPerUser: 100,
  defaultPageSize: 20,
  maxContentLength: 280,
  supportedRegions: ['us-central1', 'europe-west1'],
} as const;
