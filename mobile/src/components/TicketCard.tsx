import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { MotiView } from 'moti';
import type { Ticket } from '../types';
import { colors, radii, spacing, typography } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  ticket: Ticket;
  index?: number;
}

const STATUS_COLOR = {
  valid: colors.success,
  used: colors.textMuted,
  expired: colors.danger,
} as const;

/**
 * F001 — Digital pass card with QR for wallet display / entry scanning.
 */
export function TicketCard({ ticket, index = 0 }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const statusColor = STATUS_COLOR[ticket.status];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 320, delay: Math.min(index * 60, 240) }}
      style={styles.shadow}
    >
      <View style={styles.card}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.type}>{ticket.type.toUpperCase()} PASS</Text>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{ticket.status.toUpperCase()}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.name}>{ticket.visitorName}</Text>
          <Text style={styles.meta}>
            ${ticket.price.toFixed(2)} · {new Date(ticket.purchasedAt).toLocaleString()}
          </Text>

          <View style={styles.qrWrap}>
            <QRCode value={ticket.qrPayload} size={148} backgroundColor={colors.white} />
          </View>

          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setShowDetails((v) => !v);
            }}
            style={styles.detailsBtn}
          >
            <Text style={styles.detailsText}>
              {showDetails ? 'Hide code details' : 'Show code for staff'}
            </Text>
          </Pressable>

          {showDetails ? (
            <Text style={styles.payload} selectable>
              {ticket.qrPayload}
            </Text>
          ) : null}
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  type: {
    fontFamily: typography.section.fontFamily,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 0.6,
  },
  badge: {
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: typography.label.fontFamily,
    fontSize: 10,
    color: colors.white,
  },
  body: {
    padding: spacing.lg,
  },
  name: {
    fontFamily: typography.section.fontFamily,
    fontSize: 18,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  qrWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
  },
  detailsBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  detailsText: {
    ...typography.label,
    color: colors.primary,
  },
  payload: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
});
