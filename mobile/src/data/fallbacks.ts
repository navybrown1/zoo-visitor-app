import type { MapPayload, ParkingLot, SafetyNotification, WeatherAlert } from '../types';

/** Offline fallbacks so the prototype still renders if the API is down. */

export const fallbackMap: MapPayload = {
  visitorEntrance: { latitude: 40.7674, longitude: -73.9712 },
  exhibits: [
    {
      id: 'ex-lions',
      name: 'Lion Habitat',
      category: 'mammals',
      latitude: 40.7678,
      longitude: -73.9718,
      description: 'African lions and pride overlook',
      imageUrl:
        'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ex-penguins',
      name: 'Penguin Coast',
      category: 'birds',
      latitude: 40.7685,
      longitude: -73.9732,
      description: 'Gentoo and king penguins',
      imageUrl:
        'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ex-reptiles',
      name: 'Reptile House',
      category: 'reptiles',
      latitude: 40.7669,
      longitude: -73.9725,
      description: 'Snakes, lizards, and turtles',
      imageUrl:
        'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ex-elephants',
      name: 'Elephant Crossing',
      category: 'mammals',
      latitude: 40.7692,
      longitude: -73.9705,
      description: 'Asian elephant herd',
      imageUrl:
        'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ex-aquarium',
      name: 'Aquatic Pavilion',
      category: 'aquatic',
      latitude: 40.7672,
      longitude: -73.9740,
      description: 'Freshwater and marine exhibits',
      imageUrl:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  services: [
    {
      id: 'svc-rr-1',
      name: 'Main Plaza Restrooms',
      type: 'restroom',
      latitude: 40.7675,
      longitude: -73.9720,
      accessible: true,
    },
    {
      id: 'svc-acc-1',
      name: 'Accessibility Hub',
      type: 'accessibility',
      latitude: 40.7670,
      longitude: -73.9715,
      accessible: true,
    },
    {
      id: 'svc-fam-1',
      name: 'Family Care Center',
      type: 'family',
      latitude: 40.7668,
      longitude: -73.9730,
      accessible: true,
    },
  ],
};

export const fallbackParking: ParkingLot[] = [
  { id: 'lot-a', name: 'Lot A — Main Entrance', capacity: 400, occupied: 312, available: 88, fillPercent: 78 },
  { id: 'lot-b', name: 'Lot B — Overflow', capacity: 250, occupied: 98, available: 152, fillPercent: 39 },
];

export const fallbackWeather: WeatherAlert = {
  tempF: 92,
  heatIndex: 98,
  alertLevel: 'warning',
  message: 'Heat advisory in effect. Seek shade and drink water.',
  updatedAt: new Date().toISOString(),
};

export const fallbackNotifications: SafetyNotification[] = [
  {
    id: 'notif-offline',
    type: 'lost_child',
    title: 'Lost Child Alert (offline)',
    message: 'Connect to the API for live safety broadcasts.',
    createdAt: new Date().toISOString(),
    active: true,
  },
];
