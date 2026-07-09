/** Shared TypeScript models for Sprint 1 features. */

export type TicketType = 'adult' | 'child' | 'senior' | 'family';
export type TicketStatus = 'valid' | 'used' | 'expired';

export interface Ticket {
  id: string;
  type: TicketType;
  visitorName: string;
  price: number;
  qrPayload: string;
  purchasedAt: string;
  status: TicketStatus;
}

export interface Exhibit {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  description: string;
  /** Animal / habitat photo shown on map cards and chips */
  imageUrl?: string;
}

export type ServiceType = 'restroom' | 'accessibility' | 'family';

export interface GuestService {
  id: string;
  name: string;
  type: ServiceType;
  latitude: number;
  longitude: number;
  accessible: boolean;
  description?: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface ParkingLot {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  available: number;
  fillPercent: number;
}

export interface WeatherAlert {
  tempF: number;
  heatIndex: number;
  alertLevel: 'none' | 'info' | 'warning' | 'danger';
  message: string;
  updatedAt: string;
}

export type NotificationType = 'lost_child' | 'emergency';

export interface SafetyNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  active: boolean;
}

export interface MapPayload {
  visitorEntrance: LatLng;
  exhibits: Exhibit[];
  services: GuestService[];
}

export interface RoutePayload {
  exhibitId: string;
  exhibitName: string;
  origin: LatLng;
  coordinates: LatLng[];
}
