import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

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
        headerBackTitleVisible: false,
        headerBackTitle: ' ',
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
  const { usuario, logout } = useAuth();

  const cargo = usuario?.is_admin ? 'Administrador' : 'Técnico';
  const loja = usuario?.loja?.nome;
  const nome = usuario?.nome || usuario?.username || '';
  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F4FF' }}>
      <SafeAreaView style={{ backgroundColor: '#2B4FE8' }}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '700' }}>Configurações</Text>
        </View>
      </SafeAreaView>

      <View style={{ padding: 20, gap: 16 }}>

        <View
          style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: '#DDE3FF',
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#2B4FE8',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '700' }}>{iniciais || '?'}</Text>
          </View>

          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A' }}>{nome}</Text>

          <View
            style={{
              backgroundColor: '#2B4FE820',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
              marginTop: 8,
            }}
          >
            <Text style={{ color: '#2B4FE8', fontSize: 12, fontWeight: '600' }}>{cargo}</Text>
          </View>

          {loja && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Ionicons name="business-outline" size={16} color="#888" />
              <Text style={{ fontSize: 13, color: '#888', marginLeft: 6 }}>{loja}</Text>
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 16,
            borderWidth: 0.5,
            borderColor: '#DDE3FF',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <Text style={{ fontSize: 13, color: '#888' }}>Aplicativo</Text>
            <Text style={{ fontSize: 13, color: '#333', fontWeight: '600' }}>CROMA Mobile</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <Text style={{ fontSize: 13, color: '#888' }}>Versão</Text>
            <Text style={{ fontSize: 13, color: '#333', fontWeight: '600' }}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: '#FFF',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            borderWidth: 1,
            borderColor: '#EF4444',
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontWeight: '600' }}>Sair</Text>
        </TouchableOpacity>

      </View>
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