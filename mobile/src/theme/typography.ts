import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  display: 'Nunito_800ExtraBold',
  displaySemi: 'Nunito_700Bold',
} as const;

export const typography = {
  display: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.text,
  } satisfies TextStyle,
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    color: colors.primary,
  } satisfies TextStyle,
  section: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  } satisfies TextStyle,
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  } satisfies TextStyle,
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  } satisfies TextStyle,
  button: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.white,
  } satisfies TextStyle,
} as const;
