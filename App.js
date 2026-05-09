import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OSListScreen from './src/screens/OSListScreen';
import OSDetalheScreen from './src/screens/OSDetalheScreen';
import OSCriarScreen from './src/screens/OSCriarScreen';
import OSEditarScreen from './src/screens/OSEditarScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function OSStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2B4FE8' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="OSLista" component={OSListScreen} options={{ title: 'Ordens de Serviço' }} />
      <Stack.Screen name="OSDetalhe" component={OSDetalheScreen} options={{ title: 'Detalhes da OS' }} />
      <Stack.Screen name="OSCriar" component={OSCriarScreen} options={{ title: 'Nova OS' }} />
      <Stack.Screen name="OSEditar" component={OSEditarScreen} options={{ title: 'Editar OS' }} />
    </Stack.Navigator>
  );
}

function ConfigScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F4FF' }}>
      <TouchableOpacity
        onPress={logout}
        style={{ backgroundColor: '#2B4FE8', padding: 14, borderRadius: 10, width: 200, alignItems: 'center' }}
      >
        <Text style={{ color: '#FFF', fontWeight: '600' }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            OS: 'list-outline',
            Configuracoes: 'settings-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2B4FE8',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { borderTopColor: '#DDE3FF' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="OS" component={OSStack} options={{ title: 'OS' }} />
      <Tab.Screen name="Configuracoes" component={ConfigScreen} options={{ title: 'Config' }} />
    </Tab.Navigator>
  );
}

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

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}