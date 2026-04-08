import React, { useState } from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

function AppContent() {
  const { usuario, carregando } = useAuth();
  const [splashFinalizada, setSplashFinalizada] = useState(false);

  if (!splashFinalizada) {
    return <SplashScreen onFinish={() => setSplashFinalizada(true)} />;
  }

  if (carregando) {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (!usuario) {
    return <LoginScreen onLoginSucesso={() => {}} />;
  }

  return <HomeScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}