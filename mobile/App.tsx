import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { RootTabs } from './src/navigation/RootTabs';
import { colors } from './src/theme';

/**
 * Zoo Visitor App — Sprint 1 MVP entry point.
 * Features: F001, F002, F006, F009, F010, F013, F014
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [ready, setReady] = useState(false);

  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (fontsLoaded) markReady();
  }, [fontsLoaded, markReady]);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.shell}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <RootTabs />
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#0D3B12' : colors.background,
    ...(Platform.OS === 'web'
      ? ({
          alignItems: 'center',
          justifyContent: 'center',
        } as const)
      : null),
  },
  shell: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    ...(Platform.OS === 'web'
      ? ({
          maxWidth: 430,
          width: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        } as const)
      : null),
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
