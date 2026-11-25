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
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api');

export const getBackendRootUrl = () => {
  return (API_BASE_URL || '').replace(/\/api\/?$/, '');
};

export const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  let resolved = url.trim();

  // If local dev URL leaked into database, strip localhost:5000
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (resolved.includes('localhost:5000')) {
      resolved = resolved.split('localhost:5000')[1];
    }
  }

  // Rewrite direct /uploads on luma.saltwellness.me to /api/uploads so Nginx proxies to backend
  if (resolved.includes('luma.saltwellness.me/uploads/')) {
    resolved = resolved.replace('luma.saltwellness.me/uploads/', 'luma.saltwellness.me/api/uploads/');
  }

  // Fix legacy bloodme prefix
  if (resolved.includes('astro.bloodme.in/uploads/')) {
    resolved = resolved.replace('astro.bloodme.in/uploads/', 'astro.bloodme.in/luma-api/uploads/');
  }

  // Ensure relative /uploads paths use /api/uploads prefix so Nginx routes to backend
  if (resolved.startsWith('/uploads/')) {
    resolved = `/api${resolved}`;
  }

  // If relative /api/uploads/, resolve against active backend host
  if (resolved.startsWith('/api/uploads/')) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      if (API_BASE_URL.startsWith('http')) {
        resolved = `${API_BASE_URL.replace(/\/api\/?$/, '')}${resolved}`;
      }
    } else {
      resolved = `http://localhost:5000${resolved}`;
    }
  }

  // Prevent mixed content when on HTTPS page
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && resolved.startsWith('http://') && !resolved.includes('localhost')) {
    resolved = resolved.replace('http://', 'https://');
  }

  return resolved;
};

export default API_BASE_URL;

