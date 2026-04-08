import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { loginComGoogle } from '../services/googleAuth';

export default function LoginScreen({ onLoginSucesso }) {
  const { login, loginComGoogle: loginComGoogleContext } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Informe usuário e senha.');
      return;
    }

    setCarregando(true);
    try {
      await login(username.trim(), password);
      onLoginSucesso();
    } catch (erro) {
      Alert.alert('Erro', erro.message || 'Não foi possível fazer login.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleGoogleLogin() {
    setCarregandoGoogle(true);
    try {
      const idToken = await loginComGoogle();
      await loginComGoogleContext(idToken);
      onLoginSucesso();
    } catch (erro) {
      Alert.alert('Erro', erro.message || 'Não foi possível fazer login com Google.');
    } finally {
      setCarregandoGoogle(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.conteudo}>

        <View style={styles.topo}>
          <Text style={styles.titulo}>Seja bem vindo!</Text>
          <Text style={styles.subtitulo}>Efetue seu login</Text>
        </View>

        <View style={styles.formulario}>
          <View style={styles.campo}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="seu.usuario"
              placeholderTextColor="#B0B0B0"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputSenhaContainer}>
              <TextInput
                style={styles.inputSenha}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!senhaVisivel}
                placeholder="••••••••"
                placeholderTextColor="#B0B0B0"
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Ionicons
                  name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#B0B0B0"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.botaoTexto}>Acessar</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLinha} />
            <Text style={styles.dividerTexto}>ou</Text>
            <View style={styles.dividerLinha} />
          </View>

          <TouchableOpacity
            style={[styles.botaoGoogle, carregandoGoogle && styles.botaoDesabilitado]}
            onPress={handleGoogleLogin}
            disabled={carregandoGoogle}
          >
            {carregandoGoogle
              ? <ActivityIndicator color="#2B4FE8" />
              : <>
                  <Ionicons name="logo-google" size={18} color="#2B4FE8" />
                  <Text style={styles.botaoGoogleTexto}>Entrar com Google</Text>
                </>
            }
          </TouchableOpacity>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  topo: {
    marginBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B4FE8',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 0,
    textAlign: 'center',
  },
  formulario: {
    borderWidth: 1,
    borderColor: '#DDE3FF',
    borderRadius: 12,
    padding: 24,
  },
  campo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDE3FF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFBFF',
  },
  inputSenhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3FF',
    borderRadius: 8,
    backgroundColor: '#FAFBFF',
    paddingRight: 12,
  },
  inputSenha: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  botao: {
    backgroundColor: '#2B4FE8',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLinha: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#DDE3FF',
  },
  dividerTexto: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#888',
  },
  botaoGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#DDE3FF',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FAFBFF',
  },
  botaoGoogleTexto: {
    color: '#2B4FE8',
    fontSize: 14,
    fontWeight: '500',
  },
});