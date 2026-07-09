import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { Ticket } from '../types';

interface Props {
  ticket: Ticket;
}

/**
 * F001 — Digital pass card with QR for wallet display / entry scanning.
 */
export function TicketCard({ ticket }: Props) {
  const statusColor =
    ticket.status === 'valid' ? '#2E7D32' : ticket.status === 'used' ? '#757575' : '#C62828';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{ticket.type.toUpperCase()} PASS</Text>
        <Text style={[styles.status, { color: statusColor }]}>{ticket.status.toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{ticket.visitorName}</Text>
      <Text style={styles.meta}>
        ${ticket.price.toFixed(2)} · {new Date(ticket.purchasedAt).toLocaleString()}
      </Text>
      <View style={styles.qrWrap}>
        <QRCode value={ticket.qrPayload} size={140} />
      </View>
      <Text style={styles.payload} selectable>
        {ticket.qrPayload}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  type: { fontWeight: '800', color: '#1B5E20', fontSize: 14 },
  status: { fontWeight: '700', fontSize: 12 },
  name: { fontSize: 18, fontWeight: '600', color: '#222' },
  meta: { fontSize: 12, color: '#666', marginTop: 2, marginBottom: 12 },
  qrWrap: { alignItems: 'center', marginVertical: 8 },
  payload: { fontSize: 10, color: '#888', textAlign: 'center', marginTop: 8 },
});
