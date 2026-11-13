/**
 * LUMA API Configuration
 * Automatically points to production HTTPS backend when deployed (e.g., on Vercel),
 * and localhost:5000 during local development.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

export default API_BASE_URL;

