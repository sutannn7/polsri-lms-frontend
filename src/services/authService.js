import user from '../data/user.json';

// MOCK AUTHENTICATION --------------------------------------------------------
// This is a stand-in for the real sign-in flow: any NIP / NPM / NIK with a
// password of at least 6 characters is accepted and the session marker is kept
// in sessionStorage. Replace this module with a real API call and a server
// issued session once the backend is available. The password is never stored,
// here or in the session marker.
const SESSION_KEY = 'learnease_session';
const SIMULATED_LOGIN_DELAY = 700;

function readSession() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    return session && typeof session.id === 'string' ? session : null;
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const session = readSession();
  return session ? { ...user, id: session.id } : null;
}

export async function login(id, password) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('NIP / NPM / NIK wajib diisi.');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('Kata sandi minimal 6 karakter.');
  }

  await new Promise((resolve) => window.setTimeout(resolve, SIMULATED_LOGIN_DELAY));

  // Identity and time only: id (NIP / NPM / NIK as typed) plus the profile name.
  const session = {
    id: id.trim(),
    name: user.name,
    loginAt: new Date().toISOString(),
  };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return getCurrentUser();
}

export function logout() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
