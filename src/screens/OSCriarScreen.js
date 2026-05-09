import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { criarOS, listarCategorias, listarLojas } from '../services/ordens';
import { useAuth } from '../context/AuthContext';

const PRIORIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'];
const PRIORIDADE_LABELS = {
  BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta', CRITICA: 'Crítica'
};
const PRIORIDADE_CORES = {
  BAIXA: '#10B981', MEDIA: '#F59E0B', ALTA: '#EF4444', CRITICA: '#7C3AED'
};

export default function OSCriarScreen({ navigation }) {
  const { usuario } = useAuth();
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [prioridade, setPrioridade] = useState('MEDIA');
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [lojas, setLojas] = useState([]);
  const [lojaId, setLojaId] = useState(usuario?.loja?.id || null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        const [cats, ljs] = await Promise.all([listarCategorias(), listarLojas()]);
        setCategorias(cats);
        setLojas(ljs);
        if (!lojaId && ljs.length > 0) {
          setLojaId(ljs[0].id);
        }
      } catch {
        Alert.alert('Aviso', 'Não foi possível carregar todos os dados.');
      } finally {
        setCarregandoDados(false);
      }
    }
    buscarDados();
  }, []);

  async function handleCriar() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Informe a descrição do problema.');
      return;
    }
    if (!lojaId) {
      Alert.alert('Atenção', 'Selecione uma loja.');
      return;
    }

    setCarregando(true);
    try {
      await criarOS({
        descricao_problema: descricao,
        observacoes,
        prioridade,
        categoria_id: categoriaId,
        loja_id: lojaId,
      });
      Alert.alert('Sucesso', 'OS criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoDados) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2B4FE8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      <View style={styles.card}>
        <Text style={styles.label}>Descrição do problema *</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o problema detalhadamente..."
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Loja *</Text>
        <View style={styles.opcoesContainer}>
          {lojas.map(l => (
            <TouchableOpacity
              key={l.id}
              style={[styles.opcaoBtn, lojaId === l.id && styles.opcaoBtnAtivo]}
              onPress={() => setLojaId(l.id)}
            >
              <Text style={[styles.opcaoBtnTexto, lojaId === l.id && styles.opcaoBtnTextoAtivo]}>
                {l.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Prioridade</Text>
        <View style={styles.opcoesContainer}>
          {PRIORIDADES.map(p => (
            <TouchableOpacity
              key={p}
              style={[
                styles.opcaoBtn,
                prioridade === p && { backgroundColor: PRIORIDADE_CORES[p], borderColor: PRIORIDADE_CORES[p] }
              ]}
              onPress={() => setPrioridade(p)}
            >
              <Text style={[
                styles.opcaoBtnTexto,
                prioridade === p && { color: '#FFF' }
              ]}>
                {PRIORIDADE_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.opcoesContainer}>
          <TouchableOpacity
            style={[styles.opcaoBtn, !categoriaId && styles.opcaoBtnAtivo]}
            onPress={() => setCategoriaId(null)}
          >
            <Text style={[styles.opcaoBtnTexto, !categoriaId && styles.opcaoBtnTextoAtivo]}>
              Nenhuma
            </Text>
          </TouchableOpacity>
          {categorias.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.opcaoBtn, categoriaId === c.id && styles.opcaoBtnAtivo]}
              onPress={() => setCategoriaId(c.id)}
            >
              <Text style={[styles.opcaoBtnTexto, categoriaId === c.id && styles.opcaoBtnTextoAtivo]}>
                {c.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Informações adicionais..."
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.botao, carregando && styles.botaoDesabilitado]}
        onPress={handleCriar}
        disabled={carregando}
      >
        {carregando
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.botaoTexto}>Criar Ordem de Serviço</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  conteudo: {
    padding: 16,
    gap: 12,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#DDE3FF',
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
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
  inputMultilinha: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  opcoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcaoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE3FF',
    backgroundColor: '#FAFBFF',
  },
  opcaoBtnAtivo: {
    backgroundColor: '#2B4FE8',
    borderColor: '#2B4FE8',
  },
  opcaoBtnTexto: {
    fontSize: 13,
    color: '#555',
  },
  opcaoBtnTextoAtivo: {
    color: '#FFF',
  },
  botao: {
    backgroundColor: '#2B4FE8',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});