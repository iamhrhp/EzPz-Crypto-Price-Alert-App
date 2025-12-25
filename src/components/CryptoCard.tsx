import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';
import { colors } from '../utils/colors';
import { CryptoMarketData } from '../api/coinGeckoApi';

interface CryptoCardProps {
  crypto: CryptoMarketData | { name: string; symbol: string; current_price?: number; usd?: number; price_change_percentage_24h?: number; market_cap?: number } | null;
  onPress: () => void;
}

export default function CryptoCard({ crypto, onPress }: CryptoCardProps) {
  if (!crypto) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name}>{crypto.name}</Text>
          <Text style={styles.symbol}>
            {crypto.symbol?.toUpperCase() || 'N/A'}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatCurrency(crypto.current_price || (crypto as any).usd)}
          </Text>
          {crypto.price_change_percentage_24h !== undefined && (
            <Text
              style={[
                styles.change,
                { color: getChangeColor(crypto.price_change_percentage_24h) },
              ]}
            >
              {formatPercentage(crypto.price_change_percentage_24h)}
            </Text>
          )}
        </View>
      </View>
      {crypto.market_cap && (
        <View style={styles.footer}>
          <Text style={styles.marketCap}>
            Market Cap: {formatCurrency(crypto.market_cap)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: 12,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  symbol: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  change: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  marketCap: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});


