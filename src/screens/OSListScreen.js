import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Alert, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarOS } from '../services/ordens';

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

export default function OSListScreen({ navigation }) {
  const [ordens, setOrdens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState('');

  async function carregar() {
    try {
      const data = await listarOS();
      setOrdens(data);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregar);
    return unsubscribe;
  }, [navigation]);

  const ordensFiltradas = ordens.filter(item => {
    const termo = busca.toLowerCase();
    return (
      String(item.id).includes(termo) ||
      item.descricao_problema?.toLowerCase().includes(termo) ||
      item.loja?.nome?.toLowerCase().includes(termo) ||
      STATUS_LABELS[item.status]?.toLowerCase().includes(termo)
    );
  });

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OSDetalhe', { id: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>OS-{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: STATUS_CORES[item.status] + '20' }]}>
            <Text style={[styles.badgeTexto, { color: STATUS_CORES[item.status] }]}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>
        <Text style={styles.cardLoja}>{item.loja?.nome}</Text>
        <Text style={styles.cardDescricao} numberOfLines={2}>
          {item.descricao_problema}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardData}>
            {new Date(item.data_abertura).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.cardVer}>Ver →</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2B4FE8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buscaContainer}>
        <Ionicons name="search-outline" size={18} color="#888" style={styles.buscaIcone} />
        <TextInput
          style={styles.buscaInput}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por ID, descrição, loja..."
          placeholderTextColor="#B0B0B0"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={ordensFiltradas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); carregar(); }}
            colors={['#2B4FE8']}
          />
        }
        ListEmptyComponent={
          <View style={styles.centro}>
            <Text style={styles.vazio}>
              {busca ? 'Nenhuma OS encontrada para essa busca.' : 'Nenhuma OS encontrada.'}
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('OSCriar')}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#DDE3FF',
    paddingHorizontal: 12,
  },
  buscaIcone: {
    marginRight: 8,
  },
  buscaInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  lista: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#DDE3FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2B4FE8',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardLoja: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  cardDescricao: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardData: {
    fontSize: 11,
    color: '#888',
  },
  cardVer: {
    fontSize: 12,
    color: '#2B4FE8',
    fontWeight: '600',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  vazio: {
    color: '#888',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2B4FE8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabTexto: {
    color: '#FFF',
    fontSize: 28,
    lineHeight: 32,
  },
});