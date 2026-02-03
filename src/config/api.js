const normalizeBaseUrl = (url) => {
  if (!url) return url;
  return url.replace(/\/+$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(
  process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    'https://ecommerce-backend-u9c5.onrender.com'
);

export const API_URL = `${API_BASE_URL}/api`;

export const backendAssetUrl = (maybeUrl) => {
  if (!maybeUrl) return maybeUrl;
  if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
  return `${API_BASE_URL}${maybeUrl}`;
};
