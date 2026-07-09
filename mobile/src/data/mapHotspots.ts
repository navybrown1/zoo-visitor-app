/** Percentage hotspots aligned to the illustrated park-map.png (1024×768). */
export const MAP_HOTSPOTS: Record<
  string,
  { top: `${number}%`; left: `${number}%`; width: `${number}%`; height: `${number}%` }
> = {
  // 1 Lion — top-left rocky overlook
  'ex-lions': { top: '10%', left: '4%', width: '42%', height: '34%' },
  // 2 Penguin — top-right arctic pool
  'ex-penguins': { top: '8%', left: '52%', width: '44%', height: '34%' },
  // 3 Reptile — center glass dome
  'ex-reptiles': { top: '38%', left: '28%', width: '44%', height: '28%' },
  // 4 Elephant — bottom-left grassy yard
  'ex-elephants': { top: '58%', left: '2%', width: '46%', height: '32%' },
  // 5 Aquatic — bottom-right wave building
  'ex-aquarium': { top: '56%', left: '50%', width: '46%', height: '34%' },
};

export const SERVICE_HOTSPOTS: Record<string, { top: `${number}%`; left: `${number}%` }> = {
  'svc-rr-1': { top: '86%', left: '46%' },
  'svc-rr-2': { top: '24%', left: '70%' },
  'svc-acc-1': { top: '48%', left: '16%' },
  'svc-acc-2': { top: '44%', left: '58%' },
  'svc-fam-1': { top: '84%', left: '30%' },
  'svc-fam-2': { top: '70%', left: '78%' },
};
