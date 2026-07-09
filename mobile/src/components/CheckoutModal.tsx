import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import type { Ticket, TicketType } from '../types';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { colors, radii, spacing, typography } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchased: (ticket: Ticket) => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
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
export function CheckoutModal({ visible, onClose, onPurchased, onToast }: Props) {
  const [type, setType] = useState<TicketType>('adult');
  const [visitorName, setVisitorName] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = OPTIONS.find((o) => o.type === type)!;

  const handlePay = async () => {
    if (!visitorName.trim()) {
      onToast('Enter the visitor name for the digital pass.', 'error');
      return;
    }
    setLoading(true);
    try {
      const ticket = await api.purchaseTicket(type, visitorName.trim());
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPurchased(ticket);
      setVisitorName('');
      setType('adult');
      onClose();
      onToast('Payment successful — pass added to wallet.', 'success');
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onToast(err instanceof Error ? err.message : 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <MotiView
          from={{ translateY: 40, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 280 }}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Buy Zoo Tickets</Text>
          <Text style={styles.subtitle}>Mock checkout — no real payment processed</Text>

          <Text style={styles.label}>Visitor name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jordan Lee"
            placeholderTextColor={colors.textMuted}
            value={visitorName}
            onChangeText={setVisitorName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Ticket type</Text>
          <View style={styles.options}>
            {OPTIONS.map((opt) => {
              const active = type === opt.type;
              return (
                <Pressable
                  key={opt.type}
                  onPress={() => setType(opt.type)}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {opt.label} · ${opt.price}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.total}>Total: ${selected.price.toFixed(2)}</Text>

          <Button
            label="Pay (Mock) & Add to Wallet"
            onPress={handlePay}
            loading={loading}
            style={styles.payBtn}
          />
          <Button label="Cancel" variant="ghost" onPress={onClose} haptic={false} />
        </MotiView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.primary,
  },
  subtitle: {
    ...typography.caption,
    marginBottom: spacing.lg,
    marginTop: 4,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    fontSize: 16,
    fontFamily: typography.body.fontFamily,
    color: colors.text,
    backgroundColor: colors.background,
  },
  options: { gap: spacing.sm, marginBottom: spacing.md },
  option: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radii.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  optionTextActive: { color: colors.white },
  total: {
    fontFamily: typography.section.fontFamily,
    fontSize: 18,
    marginVertical: spacing.md,
    color: colors.text,
  },
  payBtn: { marginBottom: spacing.sm },
});
