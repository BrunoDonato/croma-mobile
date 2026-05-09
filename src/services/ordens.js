import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://croma-production.up.railway.app';

async function getHeaders() {
  const token = await SecureStore.getItemAsync('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

const CACHE_KEY = 'ordens_cache';

export async function listarOS() {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/api/os/`, { headers });
    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    }
    throw new Error(data.erro || 'Erro ao buscar OS.');
  } catch (error) {
    const cache = await AsyncStorage.getItem(CACHE_KEY);
    if (cache) return JSON.parse(cache);
    throw error;
  }
}

export async function buscarOS(id) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/api/os/${id}/`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Erro ao buscar OS.');
  return data;
}

export async function criarOS(dados) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/api/os/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dados),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Erro ao criar OS.');
  return data;
}

export async function atualizarOS(id, dados) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/api/os/${id}/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(dados),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Erro ao atualizar OS.');
  return data;
}

export async function deletarOS(id) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/api/os/${id}/`, {
    method: 'DELETE',
    headers,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Erro ao deletar OS.');
  return data;
}

export async function listarCategorias() {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/api/os/categorias/`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error('Erro ao buscar categorias.');
  return data;
}

export async function listarLojas() {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/api/lojas/`, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error('Erro ao buscar lojas.');
  return data;
}