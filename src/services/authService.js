import user from '../data/user.json';

const SESSION_KEY = 'learnease-session';
const SIMULATED_LOGIN_DELAY = 800;

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_KEY) === 'authenticated'
    ? { ...user }
    : null;
}

export async function login(id, password) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('NIP / NPM / NIK wajib diisi.');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('Kata sandi minimal 6 karakter.');
  }

  await new Promise((resolve) => window.setTimeout(resolve, SIMULATED_LOGIN_DELAY));
  window.localStorage.setItem(SESSION_KEY, 'authenticated');
  return { ...user };
}

export function logout() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}