import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { usuario, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.bemVindo}>Olá, {usuario?.nome?.split(' ')[0]}</Text>
          <Text style={styles.subtitulo}>
            {usuario?.is_admin ? 'Administrador' : 'Técnico'}
            {usuario?.loja ? ` — ${usuario.loja.nome}` : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.botaoSair} onPress={logout}>
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.corpo}>
        <Text style={styles.placeholder}>Tela principal em construção...</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  header: {
    backgroundColor: '#2B4FE8',
    padding: 24,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bemVindo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitulo: {
    fontSize: 13,
    color: '#FFFFFFAA',
    marginTop: 2,
  },
  botaoSair: {
    backgroundColor: '#FFFFFF20',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoSairTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  corpo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    color: '#888',
    fontSize: 14,
  },
});