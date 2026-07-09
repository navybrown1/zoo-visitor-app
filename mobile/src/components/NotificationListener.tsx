import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { api } from '../services/api';
import type { SafetyNotification } from '../types';

// Show alerts while the app is foregrounded (scaffold for F006).
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
  /** Poll interval in ms for mock safety broadcasts. */
  pollMs?: number;
}

/**
 * F006 — Notification listener scaffold for lost-child and emergency broadcasts.
 * Polls the Express API and surfaces in-app alerts; also schedules a local notification
 * when a new broadcast appears (mock push pipeline).
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
          // Local notification stands in for a real push provider in Sprint 1.
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
    <View style={styles.card}>
      <Text style={styles.heading}>Safety Alerts</Text>
      <Text style={styles.sub}>Listening for lost-child & emergency broadcasts</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>No active alerts.</Text>
      ) : (
        items.map((n) => (
          <View
            key={n.id}
            style={[styles.alert, n.type === 'emergency' ? styles.emergency : styles.lostChild]}
          >
            <Text style={styles.alertTitle}>{n.title}</Text>
            <Text style={styles.alertBody}>{n.message}</Text>
            <Text style={styles.alertMeta}>{new Date(n.createdAt).toLocaleString()}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  heading: { fontSize: 16, fontWeight: '700', color: '#B71C1C' },
  sub: { fontSize: 12, color: '#666', marginBottom: 10, marginTop: 2 },
  empty: { color: '#666' },
  alert: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  lostChild: { backgroundColor: '#FFF3E0' },
  emergency: { backgroundColor: '#FFEBEE' },
  alertTitle: { fontWeight: '700', fontSize: 14, color: '#222', marginBottom: 4 },
  alertBody: { fontSize: 13, color: '#333', lineHeight: 18 },
  alertMeta: { fontSize: 11, color: '#888', marginTop: 6 },
});
