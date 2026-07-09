import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import type { Ticket } from '../types';
import { TicketCard } from '../components/TicketCard';
import { CheckoutModal } from '../components/CheckoutModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { PageContainer } from '../components/ui/PageContainer';
import { Toast } from '../components/ui/Toast';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { colors, spacing } from '../theme';

/**
 * F001 — Digital ticket purchasing & wallet integration.
 */
export function TicketsScreen() {
  const isDesktop = useIsDesktop();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    tone: 'success' | 'error' | 'info';
  }>({ visible: false, message: '', tone: 'info' });

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

  const showToast = (message: string, tone: 'success' | 'error') => {
    setToast({ visible: true, message, tone });
  };

  return (
    <PageContainer maxWidth={960}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <ScreenHeader title="Ticket Wallet" subtitle="Your digital zoo passes" />
          </View>
          <Button
            label="Buy Tickets"
            onPress={() => setCheckoutOpen(true)}
            style={styles.buyBtn}
          />
        </View>

        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          numColumns={isDesktop ? 2 : 1}
          key={isDesktop ? 'desktop' : 'mobile'}
          columnWrapperStyle={isDesktop ? styles.columnWrap : undefined}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="ticket-outline"
              title="No passes yet"
              body="Purchase a mock ticket to generate a digital QR pass for entry."
              actionLabel="Buy Tickets"
              onAction={() => setCheckoutOpen(true)}
            />
          }
          renderItem={({ item, index }) => (
            <View style={isDesktop ? styles.cardCell : undefined}>
              <TicketCard ticket={item} index={index} />
            </View>
          )}
        />

        <CheckoutModal
          visible={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onPurchased={(ticket) => setTickets((prev) => [ticket, ...prev])}
          onToast={showToast}
        />

        <Toast
          visible={toast.visible}
          message={toast.message}
          tone={toast.tone}
          onHide={() => setToast((t) => ({ ...t, visible: false }))}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
  },
  headerText: { flex: 1 },
  buyBtn: {
    paddingHorizontal: spacing.md,
    minHeight: 42,
    paddingVertical: spacing.sm,
  },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  columnWrap: {
    gap: spacing.md,
  },
  cardCell: {
    flex: 1,
    maxWidth: '50%',
  },
});
