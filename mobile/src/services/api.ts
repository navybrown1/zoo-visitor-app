import { Platform } from 'react-native';
import type {
  MapPayload,
  ParkingLot,
  RoutePayload,
  SafetyNotification,
  Ticket,
  TicketType,
  WeatherAlert,
} from '../types';
import {
  fallbackMap,
  fallbackParking,
  fallbackWeather,
  fallbackNotifications,
} from '../data/fallbacks';

/**
 * API base URL:
 * - Web (local or Vercel): same-origin relative paths (empty host)
 * - Android emulator: 10.0.2.2 → host machine localhost
 * - iOS simulator: localhost:3001
 * - Override: EXPO_PUBLIC_API_URL
 */
function getApiHost(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (Platform.OS === 'web') {
    return '';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
}

const HOST = getApiHost();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${HOST}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (body as { error?: string }).error ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

export const api = {
  async getTickets(): Promise<Ticket[]> {
    try {
      const data = await request<{ tickets: Ticket[] }>('/api/tickets');
      return data.tickets;
    } catch {
      return [];
    }
  },

  async purchaseTicket(type: TicketType, visitorName: string): Promise<Ticket> {
    const data = await request<{ ticket: Ticket }>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({ type, visitorName }),
    });
    return data.ticket;
  },

  async validateTicket(
    qrPayload: string,
  ): Promise<{ valid: boolean; ticket?: Ticket; message?: string; error?: string }> {
    // Validation denials return 4xx with a JSON body — parse instead of throwing.
    const res = await fetch(`${HOST}/api/tickets/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrPayload }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      valid?: boolean;
      ticket?: Ticket;
      message?: string;
      error?: string;
    };
    return {
      valid: Boolean(body.valid),
      ticket: body.ticket,
      message: body.message,
      error: body.error ?? (res.ok ? undefined : `Request failed (${res.status})`),
    };
  },

  async getMap(): Promise<MapPayload> {
    try {
      return await request<MapPayload>('/api/map');
    } catch {
      return fallbackMap;
    }
  },

  async getRoute(exhibitId: string): Promise<RoutePayload> {
    return request(`/api/map/route/${exhibitId}`);
  },

  async getParking(): Promise<ParkingLot[]> {
    try {
      const data = await request<{ lots: ParkingLot[] }>('/api/parking');
      return data.lots;
    } catch {
      return fallbackParking;
    }
  },

  async getWeather(): Promise<WeatherAlert | null> {
    try {
      return await request<WeatherAlert>('/api/weather');
    } catch {
      return fallbackWeather;
    }
  },

  async getNotifications(): Promise<SafetyNotification[]> {
    try {
      const data = await request<{ notifications: SafetyNotification[] }>('/api/notifications');
      return data.notifications;
    } catch {
      return fallbackNotifications;
    }
  },
};

export { HOST as API_BASE_URL, getApiHost };
