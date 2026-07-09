/** Percentage positions on the illustrated park map (park-map.png). */
export const MAP_HOTSPOTS: Record<
  string,
  { top: `${number}%`; left: `${number}%`; width: `${number}%`; height: `${number}%` }
> = {
  'ex-lions': { top: '8%', left: '6%', width: '38%', height: '28%' },
  'ex-penguins': { top: '8%', left: '56%', width: '38%', height: '28%' },
  'ex-reptiles': { top: '36%', left: '30%', width: '40%', height: '26%' },
  'ex-elephants': { top: '58%', left: '4%', width: '42%', height: '28%' },
  'ex-aquarium': { top: '58%', left: '52%', width: '44%', height: '28%' },
};

export const SERVICE_HOTSPOTS: Record<
  string,
  { top: `${number}%`; left: `${number}%` }
> = {
  'svc-rr-1': { top: '78%', left: '48%' },
  'svc-rr-2': { top: '22%', left: '72%' },
  'svc-acc-1': { top: '48%', left: '18%' },
  'svc-acc-2': { top: '42%', left: '62%' },
  'svc-fam-1': { top: '82%', left: '28%' },
  'svc-fam-2': { top: '68%', left: '78%' },
};
