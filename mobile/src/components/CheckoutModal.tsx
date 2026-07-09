import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { Ticket, TicketType } from '../types';
import { api } from '../services/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchased: (ticket: Ticket) => void;
}

const OPTIONS: { type: TicketType; label: string; price: number }[] = [
  { type: 'adult', label: 'Adult', price: 32 },
  { type: 'child', label: 'Child', price: 22 },
  { type: 'senior', label: 'Senior', price: 26 },
  { type: 'family', label: 'Family Pack', price: 95 },
];

/**
 * F001 — Mock checkout flow that creates a digital pass via the Express API.
 */
export function CheckoutModal({ visible, onClose, onPurchased }: Props) {
  const [type, setType] = useState<TicketType>('adult');
  const [visitorName, setVisitorName] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = OPTIONS.find((o) => o.type === type)!;

  const handlePay = async () => {
    if (!visitorName.trim()) {
      Alert.alert('Name required', 'Enter the visitor name for the digital pass.');
      return;
    }
    setLoading(true);
    try {
      const ticket = await api.purchaseTicket(type, visitorName.trim());
      onPurchased(ticket);
      setVisitorName('');
      setType('adult');
      onClose();
      Alert.alert('Payment successful (mock)', 'Your digital pass was added to the wallet.');
    } catch (err) {
      Alert.alert('Checkout failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Buy Zoo Tickets</Text>
          <Text style={styles.subtitle}>Mock checkout — no real payment processed</Text>

          <Text style={styles.label}>Visitor name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jordan Lee"
            value={visitorName}
            onChangeText={setVisitorName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Ticket type</Text>
          <View style={styles.options}>
            {OPTIONS.map((opt) => (
              <Pressable
                key={opt.type}
                onPress={() => setType(opt.type)}
                style={[styles.option, type === opt.type && styles.optionActive]}
              >
                <Text style={[styles.optionText, type === opt.type && styles.optionTextActive]}>
                  {opt.label} · ${opt.price}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.total}>Total: ${selected.price.toFixed(2)}</Text>

          <Pressable
            style={[styles.payBtn, loading && styles.payBtnDisabled]}
            onPress={handlePay}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payText}>Pay (Mock) & Add to Wallet</Text>
            )}
          </Pressable>

          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#1B5E20' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 16, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 16,
  },
  options: { gap: 8, marginBottom: 12 },
  option: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 12,
  },
  optionActive: { backgroundColor: '#1B5E20', borderColor: '#1B5E20' },
  optionText: { fontSize: 15, color: '#1B5E20', fontWeight: '600' },
  optionTextActive: { color: '#fff' },
  total: { fontSize: 18, fontWeight: '700', marginVertical: 12, color: '#222' },
  payBtn: {
    backgroundColor: '#1B5E20',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnDisabled: { opacity: 0.7 },
  payText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancel: { alignItems: 'center', marginTop: 14 },
  cancelText: { color: '#666', fontSize: 15 },
});
