import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import type { SafetyNotification } from '../types';
import { Card } from './ui/Card';
import { EmptyState } from './ui/EmptyState';
import { colors, radii, spacing, typography } from '../theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface Props {
  pollMs?: number;
}

/**
 * F006 — Notification listener scaffold for lost-child and emergency broadcasts.
 */
export function NotificationListener({ pollMs = 8000 }: Props) {
  const [items, setItems] = useState<SafetyNotification[]>([]);
  const seenIds = useRef<Set<string>>(new Set());
  const permissionAsked = useRef(false);

  const ensurePermission = useCallback(async () => {
    if (permissionAsked.current) return;
    permissionAsked.current = true;
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  }, []);

  const poll = useCallback(async () => {
    try {
      const notifications = await api.getNotifications();
      setItems(notifications);

      for (const n of notifications) {
        if (!seenIds.current.has(n.id)) {
          seenIds.current.add(n.id);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: n.title,
              body: n.message,
              data: { type: n.type, id: n.id },
            },
            trigger: null,
          });
        }
      }
    } catch {
      // Keep last known list; api client already falls back when offline.
    }
  }, []);

  useEffect(() => {
    ensurePermission();
    poll();
    const id = setInterval(poll, pollMs);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') poll();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [ensurePermission, poll, pollMs]);

  return (
    <Card style={styles.card}>
      <View style={styles.headingRow}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.danger} />
        <Text style={styles.heading}>Safety Alerts</Text>
      </View>
      <Text style={styles.sub}>Listening for lost-child & emergency broadcasts</Text>

      {items.length === 0 ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="All clear"
          body="No active safety broadcasts right now."
        />
      ) : (
        items.map((n, index) => (
          <MotiView
            key={n.id}
            from={{ opacity: 0, translateX: -12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 280, delay: index * 50 }}
            style={[
              styles.alert,
              n.type === 'emergency' ? styles.emergency : styles.lostChild,
            ]}
          >
            <Text style={styles.alertTitle}>{n.title}</Text>
            <Text style={styles.alertBody}>{n.message}</Text>
            <Text style={styles.alertMeta}>{new Date(n.createdAt).toLocaleString()}</Text>
          </MotiView>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heading: {
    ...typography.section,
    color: colors.danger,
  },
  sub: {
    ...typography.caption,
    marginBottom: spacing.md,
    marginTop: 2,
  },
  alert: {
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lostChild: { backgroundColor: colors.warningSoft },
  emergency: { backgroundColor: colors.dangerSoft },
  alertTitle: {
    ...typography.bodyMedium,
    marginBottom: 4,
  },
  alertBody: {
    ...typography.body,
    color: colors.text,
  },
  alertMeta: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
});
