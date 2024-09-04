import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token?: string) {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (!decoded.exp) return true;

    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token', error);
    return true;
  }
}
