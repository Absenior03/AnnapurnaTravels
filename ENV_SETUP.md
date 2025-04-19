# Environment Variables Setup

This document explains how to properly set up environment variables for this project to ensure security and functionality, especially for Firebase authentication.

## Important Security Information

⚠️ **Never commit sensitive API keys or credentials to version control** ⚠️

Environment variables containing sensitive information should be kept private and not committed to public or private repositories. This project uses Next.js environment variables to manage configuration.

## Local Development Setup

1. Copy the example environment file to create your local environment configuration:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your actual Firebase credentials:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   # etc...
   ```

## Firebase Setup

To get your Firebase credentials:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ and select "Project settings"
4. Scroll down to the "Your apps" section
5. If you don't already have a web app, click the "</>" icon to add one
6. The configuration values needed will be displayed in the Firebase SDK snippet

## Production Deployment

For production environments (Vercel, Netlify, etc.), set these environment variables in your hosting platform's dashboard:

- **Vercel**: Go to Project Settings → Environment Variables
- **Netlify**: Go to Site Settings → Build & Deploy → Environment

This ensures your sensitive credentials aren't exposed in your codebase.

## Fallback Behavior

This application is designed to work with fallback values during development if environment variables are not set, but for production, all environment variables must be properly configured.

The application will show appropriate error messages when Firebase authentication is not available due to missing environment variables.

## Environment Variables Reference

| Variable                                   | Description                  | Required |
| ------------------------------------------ | ---------------------------- | -------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API Key             | Yes      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase Auth Domain         | Yes      |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase Project ID          | Yes      |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Storage Bucket      | Yes      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes      |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase App ID              | Yes      |
| `NEXT_PUBLIC_ADMIN_EMAIL`                  | Admin user email             | Yes      |
