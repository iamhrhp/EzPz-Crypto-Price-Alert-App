import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { getPopularCryptos } from '../api/coinGeckoApi';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';
import { useCurrency } from '../utils/currencyContext';
import { colors } from '../utils/colors';
import BottomNavigation from '../components/BottomNavigation';

export default function HomeScreen({ navigation }) {
  const { currency } = useCurrency();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCryptoPrices();
  }, [currency]);

  const loadCryptoPrices = async () => {
    try {
      setLoading(true);
      const data = await getPopularCryptos(10, currency);
      setCryptos(data);
    } catch (error) {
      console.error('Failed to load crypto prices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCryptoPrices();
  };

  if (loading && cryptos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.binanceYellow} />
        <Text style={styles.loadingText}>Loading crypto prices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.binanceYellow}
            colors={[colors.binanceYellow]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Markets</Text>
        </View>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>Coin Name</Text>
          <Text style={styles.listHeaderText}>Price</Text>
        </View>

        {cryptos.map((crypto) => (
          <TouchableOpacity
            key={crypto.id}
            style={styles.cryptoRow}
            onPress={() => {
              navigation.navigate('Alerts', { coinId: crypto.id });
            }}
            activeOpacity={0.7}
          >
            <View style={styles.cryptoLeft}>
              <View style={styles.cryptoIcon}>
                <Text style={styles.cryptoIconText}>
                  {crypto.symbol.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.cryptoInfo}>
                <Text style={styles.cryptoName}>{crypto.name}</Text>
                <Text style={styles.cryptoSymbol}>
                  {crypto.symbol.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.cryptoRight}>
              <Text style={styles.price}>
                {formatCurrency(crypto.current_price, currency)}
              </Text>
              <Text
                style={[
                  styles.change,
                  { color: getChangeColor(crypto.price_change_percentage_24h) },
                ]}
              >
                {formatPercentage(crypto.price_change_percentage_24h)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNavigation navigation={navigation} currentRoute="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listHeaderText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cryptoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cryptoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.binanceYellow,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cryptoSymbol: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  cryptoRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  change: {
    fontSize: 13,
    fontWeight: '500',
  },
});

