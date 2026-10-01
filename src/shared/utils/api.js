const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

export const apiCall = async (endpoint, options = {}, isRetry = false) => {
  const token = localStorage.getItem('scalematrix_access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // send HttpOnly refresh cookies
    });

    const data = await response.json();

    if (!response.ok) {
      // If 401 Unauthorized & access token expired, attempt automatic silent refresh token exchange
      if (response.status === 401) {
        if (!isRetry && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });
            const refreshData = await refreshRes.json();

            if (refreshRes.ok && refreshData?.data?.accessToken) {
              localStorage.setItem('scalematrix_access_token', refreshData.data.accessToken);
              // Retry original API request with refreshed token
              return apiCall(endpoint, options, true);
            }
          } catch (refreshErr) {
            console.error('Silent token refresh failed:', refreshErr);
          }
        }

        // Silent refresh failed or endpoint was auth/refresh / auth/login or retry failed: invalidate session
        localStorage.removeItem('scalematrix_access_token');
        if (typeof window !== 'undefined' && !endpoint.includes('/auth/login')) {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to ScaleMatrix authentication server. Please ensure the backend service is running.');
    }
    throw error;
  }
};
