import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MapScreen } from '../screens/MapScreen';
import { TicketsScreen } from '../screens/TicketsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { StaffScanScreen } from '../screens/StaffScanScreen';
import { colors, fonts } from '../theme';

export type RootTabParamList = {
  Map: undefined;
  Tickets: undefined;
  Dashboard: undefined;
  Staff: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

const ICONS: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Map: 'map',
  Tickets: 'ticket',
  Dashboard: 'stats-chart',
  Staff: 'scan',
};

/**
 * Core Sprint 1 navigation: Map · Tickets · Dashboard · Staff
 */
export function RootTabs() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: colors.primary,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontFamily: fonts.displaySemi,
            fontSize: 18,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.bodyMedium,
            fontSize: 11,
          },
          tabBarIcon: ({ color, size, focused }) => {
            const base = ICONS[route.name as keyof RootTabParamList];
            const outline = `${String(base)}-outline` as keyof typeof Ionicons.glyphMap;
            return (
              <Ionicons
                name={focused ? base : outline}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Park Map' }} />
        <Tab.Screen name="Tickets" component={TicketsScreen} options={{ title: 'Tickets' }} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Staff" component={StaffScanScreen} options={{ title: 'Staff Scan' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
