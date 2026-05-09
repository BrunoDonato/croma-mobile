import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { buscarOS, deletarOS } from '../services/ordens';
import { useAuth } from '../context/AuthContext';

const STATUS_CORES = {
  ABERTA: '#2B4FE8',
  EM_ANALISE: '#F59E0B',
  EM_EXECUCAO: '#8B5CF6',
  FINALIZADA: '#10B981',
  CANCELADA: '#EF4444',
};

const STATUS_LABELS = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  EM_EXECUCAO: 'Em execução',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

const PRIORIDADE_CORES = {
  BAIXA: '#10B981',
  MEDIA: '#F59E0B',
  ALTA: '#EF4444',
  CRITICA: '#7C3AED',
};

export default function OSDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { usuario } = useAuth();
  const [os, setOs] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      const data = await buscarOS(id);
      setOs(data);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  function confirmarDelete() {
    Alert.alert(
      'Excluir OS',
      'Tem certeza que deseja excluir esta OS? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarOS(id);
              Alert.alert('Sucesso', 'OS excluída com sucesso.');
              navigation.goBack();
            } catch (erro) {
              Alert.alert('Erro', erro.message);
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2B4FE8" />
      </View>
    );
  }

  if (!os) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      <View style={styles.header}>
        <Text style={styles.titulo}>OS-{os.id}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_CORES[os.status] + '20' }]}>
          <Text style={[styles.badgeTexto, { color: STATUS_CORES[os.status] }]}>
            {STATUS_LABELS[os.status]}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Campo label="Loja" valor={os.loja?.nome} />
        <Campo label="Solicitante" valor={os.solicitante} />
        <Campo label="Técnico responsável" valor={os.tecnico_responsavel || 'Não atribuído'} />
        <Campo label="Categoria" valor={os.categoria || 'Não informada'} />
        <Campo
          label="Prioridade"
          valor={os.prioridade}
          corValor={PRIORIDADE_CORES[os.prioridade]}
        />
        <Campo label="Data de abertura" valor={new Date(os.data_abertura).toLocaleString('pt-BR')} />
        {os.data_fechamento && (
          <Campo label="Data de fechamento" valor={new Date(os.data_fechamento).toLocaleString('pt-BR')} />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.secaoTitulo}>Descrição do problema</Text>
        <Text style={styles.secaoTexto}>{os.descricao_problema}</Text>
      </View>

      {os.observacoes ? (
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>Observações</Text>
          <Text style={styles.secaoTexto}>{os.observacoes}</Text>
        </View>
      ) : null}

      {os.solucao ? (
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>Solução</Text>
          <Text style={styles.secaoTexto}>{os.solucao}</Text>
        </View>
      ) : null}

      {os.motivo_cancelamento ? (
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>Motivo do cancelamento</Text>
          <Text style={styles.secaoTexto}>{os.motivo_cancelamento}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.botaoEditar}
        onPress={() => navigation.navigate('OSEditar', { id: os.id })}
      >
        <Text style={styles.botaoEditarTexto}>Editar / Atualizar status</Text>
      </TouchableOpacity>

      {usuario?.is_admin && (
        <TouchableOpacity style={styles.botaoDeletar} onPress={confirmarDelete}>
          <Text style={styles.botaoDeletarTexto}>Excluir OS</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

function Campo({ label, valor, corValor }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      <Text style={[styles.campoValor, corValor && { color: corValor, fontWeight: '600' }]}>
        {valor}
      </Text>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B4FE8',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#DDE3FF',
    gap: 10,
  },
  campo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F4FF',
    paddingBottom: 8,
  },
  campoLabel: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  campoValor: {
    fontSize: 13,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  secaoTexto: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  botaoEditar: {
    backgroundColor: '#2B4FE8',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoEditarTexto: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  botaoDeletar: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  botaoDeletarTexto: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});