import { api } from './client';
import { setAccessToken, clearAccessToken } from '../auth/secureStore';
import type { LoginRequest, LoginResponse, User } from '../types/api';

export async function login(credentials: LoginRequest): Promise<User> {
  const data = await api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials as unknown as Record<string, unknown>,
  });

  await setAccessToken(data.access_token);
  return data.user;
}

// There's no /auth/logout endpoint on the backend — signing out is purely
// a client-side action (drop the stored token).
export async function logout(): Promise<void> {
  await clearAccessToken();
}

export async function getMe(): Promise<User> {
  const data = await api<{ user: User }>('/auth/me');
  return data.user;
}
