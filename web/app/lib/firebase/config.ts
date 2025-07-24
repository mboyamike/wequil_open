const config = {
  apiKey: import.meta.env.VITE_PUBLIC_API_KEY,
  authDomain: import.meta.env.VITE_PUBLIC_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_PUBLIC_APP_ID
} as const;

type Config = typeof config;

export function getFirebaseConfig(): Config {
  if (Object.values(config).some((value) => !value))
    throw new Error('Firebase config is not set or incomplete');

  return config;
}
