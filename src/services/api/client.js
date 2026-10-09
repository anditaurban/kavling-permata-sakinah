/**
 * Permata Sakinah REST API Client
 * Reference: docs/API-SPEC.md & frontend-integration/INTEGRATION-GUIDE.md
 */

const DEFAULT_BASE_URL = 'http://localhost:5000/api/v1';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

export function getStoredToken() {
  return localStorage.getItem('ps_token') || localStorage.getItem('token') || '';
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('ps_token', token);
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('ps_token');
    localStorage.removeItem('token');
  }
}

export function clearStoredToken() {
  localStorage.removeItem('ps_token');
  localStorage.removeItem('token');
}

/**
 * Perform an HTTP request to the REST API.
 * @param {string} endpoint - API path (e.g. '/projects', '/auth/login')
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<{success: boolean, data: any, meta?: any}>}
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        // Clear token if invalid or expired
        clearStoredToken();
        // Dispatch session expired event if needed
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }

      const errorMessage =
        json.error?.message ||
        `Permintaan gagal dengan status ${response.status} (${response.statusText})`;

      const error = new Error(errorMessage);
      error.code = json.error?.code || 'API_ERROR';
      error.details = json.error?.details || {};
      error.status = response.status;
      throw error;
    }

    return json;
  } catch (err) {
    // Re-throw formatted errors
    if (err.status) throw err;

    // Network / connection errors
    const netError = new Error(
      err.message === 'Failed to fetch'
        ? 'Tidak dapat terhubung ke server backend API. Pastikan server lokal atau koneksi internet aktif.'
        : err.message
    );
    netError.code = 'NETWORK_ERROR';
    throw netError;
  }
}

export default apiRequest;
