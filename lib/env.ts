import { env } from 'next-runtime-env';

export const getEnv = (key: string, defaultValue?: string): string => {
  try {
    const value = env(key);
    return value || defaultValue || '';
  } catch (error) {
    console.error(`Error getting environment variable ${key}:`, error);
    return defaultValue || '';
  }
};

export const getApiUrl = (): string => {
  // Use runtime env if available, otherwise use production URL
  const apiUrl = getEnv('NEXT_PUBLIC_API_URL');
  if (apiUrl) return apiUrl;

  // Check if running in production (https)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return 'https://api.3du.space';
  }

  // Default for local development
  return 'http://localhost:8200';
}; 