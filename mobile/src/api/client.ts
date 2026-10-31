import Constants from 'expo-constants';
import { getAccessToken, clearAccessToken } from '../auth/secureStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:3000/api/v1';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(`${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

/**
 * Authenticated fetch wrapper.
 *
 * The backend issues a single JWT valid for 7 days — there's no refresh-token
 * endpoint, so a 401 just means the session is over and the caller needs to
 * log in again (AuthContext handles this by clearing the stored token).
 *
 * Usage:
 *   const data = await api<Extinguisher[]>('/extinguishers');
 *   const ext = await api<Extinguisher>('/extinguishers/123');
 *   await api('/extinguishers/123', { method: 'PATCH', body: { ... } });
 */
export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    await clearAccessToken();
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => undefined);
    throw new ApiError(res.status, res.statusText, data);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export { ApiError };
