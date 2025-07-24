export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const isUsingEmulator =
  isDevelopment && import.meta.env.VITE_PUBLIC_USE_EMULATOR === 'true';

export const siteURL = import.meta.env.VITE_PUBLIC_URL as string;
