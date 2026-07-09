export const routes = {
  visitorEntrance: { latitude: 40.7674, longitude: -73.9712 },
  routes: {
    'ex-lions': [
      { latitude: 40.7674, longitude: -73.9712 },
      { latitude: 40.7676, longitude: -73.9715 },
      { latitude: 40.7678, longitude: -73.9718 },
    ],
    'ex-penguins': [
      { latitude: 40.7674, longitude: -73.9712 },
      { latitude: 40.7678, longitude: -73.9722 },
      { latitude: 40.7682, longitude: -73.9728 },
      { latitude: 40.7685, longitude: -73.9732 },
    ],
    'ex-reptiles': [
      { latitude: 40.7674, longitude: -73.9712 },
      { latitude: 40.7671, longitude: -73.9718 },
      { latitude: 40.7669, longitude: -73.9725 },
    ],
    'ex-elephants': [
      { latitude: 40.7674, longitude: -73.9712 },
      { latitude: 40.7680, longitude: -73.9708 },
      { latitude: 40.7686, longitude: -73.9706 },
      { latitude: 40.7692, longitude: -73.9705 },
    ],
    'ex-aquarium': [
      { latitude: 40.7674, longitude: -73.9712 },
      { latitude: 40.7673, longitude: -73.9725 },
      { latitude: 40.7672, longitude: -73.9740 },
    ],
  } as Record<string, { latitude: number; longitude: number }[]>,
};
