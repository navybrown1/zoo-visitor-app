import { useWindowDimensions } from 'react-native';

/** Desktop website breakpoint — wide browser layouts kick in above this. */
export const DESKTOP_BREAKPOINT = 900;

export function useIsDesktop() {
  const { width } = useWindowDimensions();
  return width >= DESKTOP_BREAKPOINT;
}
