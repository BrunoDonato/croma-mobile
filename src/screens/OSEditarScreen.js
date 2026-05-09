import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { buscarOS, atualizarOS } from '../services/ordens';
import { useAuth } from '../context/AuthContext';

const STATUS_FLOW = {
  ABERTA: ['EM_ANALISE', 'CANCELADA'],
  EM_ANALISE: ['EM_EXECUCAO', 'CANCELADA'],
  EM_EXECUCAO: ['FINALIZADA', 'CANCELADA'],
  FINALIZADA: [],
  CANCELADA: [],
};

const STATUS_LABELS = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  EM_EXECUCAO: 'Em execução',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

const STATUS_CORES = {
  ABERTA: '#2B4FE8',
  EM_ANALISE: '#F59E0B',
  EM_EXECUCAO: '#8B5CF6',
  FINALIZADA: '#10B981',
  CANCELADA: '#EF4444',
};

export default function OSEditarScreen({ route, navigation }) {
  const { id } = route.params;
  const { usuario } = useAuth();
  const [os, setOs] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [observacoes, setObservacoes] = useState('');
  const [solucao, setSolucao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [novoStatus, setNovoStatus] = useState(null);
  const [textoAndamento, setTextoAndamento] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarOS(id);
        setOs(data);
        setObservacoes(data.observacoes || '');
        setSolucao(data.solucao || '');
        setMotivo(data.motivo_cancelamento || '');
      } catch (erro) {
        Alert.alert('Erro', erro.message);
        navigation.goBack();
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function handleSalvar() {
    if (novoStatus === 'FINALIZADA' && !solucao.trim()) {
      Alert.alert('Atenção', 'Informe a solução antes de finalizar.');
      return;
    }
    if (novoStatus === 'CANCELADA' && !motivo.trim()) {
      Alert.alert('Atenção', 'Informe o motivo do cancelamento.');
      return;
    }

    setSalvando(true);
    try {
      await atualizarOS(id, {
        observacoes,
        solucao,
        motivo_cancelamento: motivo,
        status: novoStatus || os.status,
        texto_andamento: textoAndamento,
      });
      Alert.alert('Sucesso', 'OS atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2B4FE8" />
      </View>
    );
  }

  const proximosStatus = STATUS_FLOW[os.status] || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>OS-{os.id} — {os.loja?.nome}</Text>
        <Text style={styles.cardDescricao}>{os.descricao_problema}</Text>
      </View>

      {proximosStatus.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>Alterar status</Text>
          <View style={styles.statusContainer}>
            {proximosStatus.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusBtn,
                  novoStatus === s && { backgroundColor: STATUS_CORES[s], borderColor: STATUS_CORES[s] }
                ]}
                onPress={() => setNovoStatus(novoStatus === s ? null : s)}
              >
                <Text style={[
                  styles.statusBtnTexto,
                  novoStatus === s && { color: '#FFF' }
                ]}>
                  {STATUS_LABELS[s]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {novoStatus === 'FINALIZADA' && (
        <View style={styles.card}>
          <Text style={styles.label}>Solução *</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinha]}
            value={solucao}
            onChangeText={setSolucao}
            placeholder="Descreva a solução aplicada..."
            placeholderTextColor="#B0B0B0"
            multiline
            numberOfLines={4}
          />
        </View>
      )}

      {novoStatus === 'CANCELADA' && (
        <View style={styles.card}>
          <Text style={styles.label}>Motivo do cancelamento *</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinha]}
            value={motivo}
            onChangeText={setMotivo}
            placeholder="Informe o motivo do cancelamento..."
            placeholderTextColor="#B0B0B0"
            multiline
            numberOfLines={4}
          />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Adicione observações..."
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Registro de andamento</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          value={textoAndamento}
          onChangeText={setTextoAndamento}
          placeholder="Descreva o que foi feito..."
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.botao, salvando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        {salvando
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.botaoTexto}>Salvar alterações</Text>
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
  cardTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2B4FE8',
  },
  cardDescricao: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE3FF',
  },
  statusBtnTexto: {
    fontSize: 13,
    color: '#555',
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