# Twitter Clone

This is a Twitter clone originally from [ccrsxx/twitter-clone](https://github.com/ccrsxx/twitter-clone).

## About

We are using this Twitter clone as inspiration for building our own social media feed application. This project serves as a reference implementation and starting point for our social media platform development.


## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Firebase
- SWR
- Headless UI
- React Hot Toast
- Framer Motion

## Getting Started

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/ccrsxx/twitter-clone.git
   ```

1. Install dependencies

   ```bash
   npm i
   ```

1. Create a Firebase project and select the web app

1. Add your Firebase config to `.env.development`. Note that `NEXT_PUBLIC_MEASUREMENT_ID` is optional

1. Make sure you have enabled the following Firebase services:

   - Authentication. Enable the Google sign-in method.
   - Cloud Firestore. Create a database and set its location to your nearest region.
   - Cloud Storage. Create a storage bucket.

1. Install Firebase CLI globally

   ```bash
   npm i -g firebase-tools
   ```

1. Log in to Firebase

   ```bash
   firebase login
   ```

1. Get your project ID

   ```bash
   firebase projects:list
   ```

1. Select your project ID

   ```bash
   firebase use your-project-id
   ```

1. At this point, you have two choices. Either run this project using the Firebase on the cloud or locally using emulator.

   1. Using the Firebase Cloud Backend:

      1. Deploy Firestore rules, Firestore indexes, and Cloud Storage rules

         ```bash
         firebase deploy --except functions
         ```

      1. Run the project

         ```bash
         npm run dev
         ```

   1. Using Firebase Local Emulator:

      1. Install [Java JDK version 11 or higher](https://jdk.java.net/) before proceeding. This is required to run the emulators.

      1. Set the environment variable `NEXT_PUBLIC_USE_EMULATOR` to `true` in `.env.development`. This will make the app use the emulators instead of the cloud backend.

      1. At this point, you can run the following command to have a fully functional Twitter clone running locally:

         ```bash
         npm run dev:emulators
         ```

> **_Note_**: When you deploy Firestore indexes rules, it might take a few minutes to complete. So before the indexes are enabled, you will get an error when you fetch the data from Firestore.<br><br>You can check the status of your Firestore indexes with the link below, replace `your-project-id` with your project ID: https://console.firebase.google.com/u/0/project/your-project-id/firestore/indexes
