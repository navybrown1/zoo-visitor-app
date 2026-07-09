import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootTabs } from './src/navigation/RootTabs';

/**
 * Zoo Visitor App — Sprint 1 MVP entry point.
 * Features: F001, F002, F006, F009, F010, F013, F014
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootTabs />
    </SafeAreaProvider>
  );
}
