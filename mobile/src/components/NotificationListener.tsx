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

/** F006 — Listener for verified API-provided lost-child and emergency broadcasts. */
export function NotificationListener({ pollMs = 8000 }: Props) {
  const [items, setItems] = useState<SafetyNotification[]>([]);
  const seenIds = useRef<Set<string>>(new Set());
  const permissionAsked = useRef(false);

  const ensurePermission = useCallback(async (): Promise<boolean> => {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    if (permissionAsked.current) return false;

    permissionAsked.current = true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === 'granted';
  }, []);

  const poll = useCallback(async () => {
    try {
      const notifications = await api.getNotifications();
      setItems(notifications);

      if (notifications.length === 0) return;
      const canNotify = await ensurePermission();

      for (const notification of notifications) {
        if (seenIds.current.has(notification.id)) continue;
        seenIds.current.add(notification.id);

        if (canNotify) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.title,
              body: notification.message,
              data: { type: notification.type, id: notification.id },
            },
            trigger: null,
          });
        }
      }
    } catch {
      // Fail closed: keep the last verified list and never manufacture an alert.
    }
  }, [ensurePermission]);

  useEffect(() => {
    void poll();
    const id = setInterval(() => void poll(), pollMs);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void poll();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [poll, pollMs]);

  return (
    <Card style={styles.card}>
      <View style={styles.headingRow}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
        <Text style={styles.heading}>Safety Alerts</Text>
      </View>
      <Text style={styles.sub}>Verified broadcasts from zoo staff appear here.</Text>

      {items.length === 0 ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="All clear"
          body="No active safety broadcasts right now."
        />
      ) : (
        items.map((notification, index) => (
          <MotiView
            key={notification.id}
            from={{ opacity: 0, translateX: -12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 280, delay: index * 50 }}
            style={[
              styles.alert,
              notification.type === 'emergency' ? styles.emergency : styles.lostChild,
            ]}
          >
            <Text style={styles.alertTitle}>{notification.title}</Text>
            <Text style={styles.alertBody}>{notification.message}</Text>
            <Text style={styles.alertMeta}>
              {new Date(notification.createdAt).toLocaleString()}
            </Text>
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
    color: colors.primary,
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
