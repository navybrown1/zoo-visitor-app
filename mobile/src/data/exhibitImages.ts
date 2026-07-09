import type { ImageSource } from 'expo-image';

/**
 * Local habitat photos (bundled assets). Prefer these over remote URLs
 * so the zoo UI always shows real animal imagery even offline.
 */
export const EXHIBIT_IMAGES: Record<string, ImageSource> = {
  'ex-lions': require('../../assets/exhibits/lions.png'),
  'ex-penguins': require('../../assets/exhibits/penguins.png'),
  'ex-reptiles': require('../../assets/exhibits/reptiles.png'),
};

/** Resolve the best image source for an exhibit (local first, then remote). */
export function getExhibitImageSource(
  exhibitId: string,
  remoteUrl?: string,
): ImageSource | undefined {
  if (EXHIBIT_IMAGES[exhibitId]) {
    return EXHIBIT_IMAGES[exhibitId];
  }
  if (remoteUrl) {
    return { uri: remoteUrl };
  }
  return undefined;
}
