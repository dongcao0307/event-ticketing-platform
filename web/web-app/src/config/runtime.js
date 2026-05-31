const trimTrailingSlash = (value) => {
  if (!value) return '';
  return value.replace(/\/+$/, '');
};

export const getApiBaseUrl = () => {
  return trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || '/api') || '/api';
};

export const getChatBaseUrl = () => {
  const apiBaseUrl = getApiBaseUrl();
  return trimTrailingSlash(import.meta.env.VITE_CHAT_BASE_URL || `${apiBaseUrl}/chat`);
};

export const getPublicSiteUrl = () => {
  const fallback = typeof window !== 'undefined' ? window.location.origin : '';
  return trimTrailingSlash(import.meta.env.VITE_PUBLIC_SITE_URL || fallback);
};
