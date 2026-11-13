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

export const getBackendRootUrl = () => {
  return (API_BASE_URL || '').replace(/\/api\/?$/, '');
};

export const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.includes('astro.bloodme.in/uploads/')) {
    return url.replace('astro.bloodme.in/uploads/', 'astro.bloodme.in/luma-api/uploads/');
  }
  if (url.startsWith('/uploads/')) {
    return `${getBackendRootUrl()}${url}`;
  }
  return url;
};

export default API_BASE_URL;

