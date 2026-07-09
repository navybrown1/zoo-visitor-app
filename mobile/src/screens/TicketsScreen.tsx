import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import type { Ticket } from '../types';
import { TicketCard } from '../components/TicketCard';
import { CheckoutModal } from '../components/CheckoutModal';

/**
 * F001 — Digital ticket purchasing & wallet integration.
 */
export function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await api.getTickets();
      setTickets(list);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ticket Wallet</Text>
        <Pressable style={styles.buyBtn} onPress={() => setCheckoutOpen(true)}>
          <Text style={styles.buyText}>Buy Tickets</Text>
        </Pressable>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No passes yet</Text>
            <Text style={styles.emptyBody}>
              Purchase a mock ticket to generate a digital QR pass for entry.
            </Text>
          </View>
        }
        renderItem={({ item }) => <TicketCard ticket={item} />}
      />

      <CheckoutModal
        visible={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onPurchased={(ticket) => setTickets((prev) => [ticket, ...prev])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#1B5E20' },
  buyBtn: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buyText: { color: '#fff', fontWeight: '700' },
  list: { padding: 16, paddingBottom: 32 },
  empty: {
    marginTop: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptyBody: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
});
