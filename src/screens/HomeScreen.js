import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, RefreshControl, Dimensions, TouchableOpacity
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAuth } from '../context/AuthContext';
import { buscarDashboard } from '../services/ordens';

const LARGURA = Dimensions.get('window').width - 32;

const STATUS_CONFIG = {
  ABERTA: { label: 'Aberta', cor: '#2B4FE8' },
  EM_ANALISE: { label: 'Em análise', cor: '#F59E0B' },
  EM_EXECUCAO: { label: 'Em execução', cor: '#8B5CF6' },
  FINALIZADA: { label: 'Finalizada', cor: '#10B981' },
  CANCELADA: { label: 'Cancelada', cor: '#EF4444' },
};

export default function HomeScreen() {
  const { usuario, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function carregar() {
    try {
      const data = await buscarDashboard();
      setDashboard(data);
    } catch (erro) {
      console.log('Erro dashboard:', erro.message);
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const dadosGrafico = dashboard?.dist_status
    ?.filter(item => item.total > 0)
    ?.map(item => ({
      name: STATUS_CONFIG[item.status]?.label || item.status,
      population: item.total,
      color: STATUS_CONFIG[item.status]?.cor || '#888',
      legendFontColor: '#555',
      legendFontSize: 12,
    })) || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); carregar(); }}
          colors={['#2B4FE8']}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.bemVindo}>Olá, {usuario?.nome?.split(' ')[0]}</Text>
          <Text style={styles.subtitulo}>
            {usuario?.is_admin ? 'Administrador' : 'Técnico'}
            {usuario?.loja ? ` — ${usuario.loja.nome}` : ''}
          </Text>
        </View>
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2B4FE8" />
        </View>
      ) : (
        <View style={styles.conteudo}>

          {dadosGrafico.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>OS por status</Text>
              <PieChart
                data={dadosGrafico}
                width={LARGURA}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute={false}
              />
            </View>
          )}

          <View style={styles.kpiGrid}>
            <KPICard
              valor={dashboard?.kpi_finalizadas_mes ?? 0}
              label="Finalizadas no mês"
              cor="#10B981"
            />
            <KPICard
              valor={dashboard?.kpi_atrasadas ?? 0}
              label="Em atraso"
              cor="#EF4444"
            />
            <KPICard
              valor={dashboard?.kpi_execucao ?? 0}
              label="Em execução"
              cor="#8B5CF6"
            />
            <KPICard
              valor={dashboard?.kpi_abertas ?? 0}
              label="Abertas"
              cor="#2B4FE8"
            />
          </View>

        </View>
      )}
    </ScrollView>
  );
}

function KPICard({ valor, label, cor }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={[styles.kpiValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
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
  conteudo: {
    padding: 16,
    gap: 16,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#DDE3FF',
    alignItems: 'center',
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B4FE8',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#DDE3FF',
    width: (LARGURA - 12) / 2,
    alignItems: 'center',
    gap: 4,
  },
  kpiValor: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});