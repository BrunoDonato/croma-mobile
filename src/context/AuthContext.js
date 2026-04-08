import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, loginGoogle as apiLoginGoogle, logout as apiLogout, getUsuario } from '../services/api';
import { logoutGoogle } from '../services/googleAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      try {
        const u = await getUsuario();
        setUsuario(u);
      } catch {
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }
    verificarSessao();
  }, []);

  async function login(username, password) {
    const data = await apiLogin(username, password);
    setUsuario(data.usuario);
    return data;
  }

  async function loginComGoogle(idToken) {
    const data = await apiLoginGoogle(idToken);
    setUsuario(data.usuario);
    return data;
  }

  async function logout() {
    await apiLogout();
    await logoutGoogle();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, loginComGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}