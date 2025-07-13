/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin
initializeApp();

// Import and export your trigger functions
export { onTweetDeleted, onTweetLiked, onTweetCreated } from './triggers/tweet_triggers';
export { onUserFollowed } from './triggers/user_triggers'

