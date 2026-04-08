import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://croma-production.up.railway.app';

const headers = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao fazer login.');
  }

  await SecureStore.setItemAsync('access_token', data.access);
  await SecureStore.setItemAsync('refresh_token', data.refresh);
  await SecureStore.setItemAsync('usuario', JSON.stringify(data.usuario));

  return data;
}

export async function loginGoogle(idToken) {
  const response = await fetch(`${BASE_URL}/api/auth/google/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao fazer login com Google.');
  }

  await SecureStore.setItemAsync('access_token', data.access);
  await SecureStore.setItemAsync('refresh_token', data.refresh);
  await SecureStore.setItemAsync('usuario', JSON.stringify(data.usuario));

  return data;
}

export async function logout() {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
  await SecureStore.deleteItemAsync('usuario');
}

export async function getUsuario() {
  const raw = await SecureStore.getItemAsync('usuario');
  return raw ? JSON.parse(raw) : null;
}