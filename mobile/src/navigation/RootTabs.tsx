import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '../screens/MapScreen';
import { TicketsScreen } from '../screens/TicketsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { StaffScanScreen } from '../screens/StaffScanScreen';

export type RootTabParamList = {
  Map: undefined;
  Tickets: undefined;
  Dashboard: undefined;
  Staff: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 11, fontWeight: focused ? '800' : '500', color: focused ? '#1B5E20' : '#888' }}>
      {label}
    </Text>
  );
}

/**
 * Core Sprint 1 navigation: Map · Tickets · Dashboard · Staff
 */
export function RootTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1B5E20' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          tabBarActiveTintColor: '#1B5E20',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: 'Park Map',
            tabBarIcon: ({ focused }) => <TabIcon label="🗺️" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Tickets"
          component={TicketsScreen}
          options={{
            title: 'Tickets',
            tabBarIcon: ({ focused }) => <TabIcon label="🎫" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Staff"
          component={StaffScanScreen}
          options={{
            title: 'Staff Scan',
            tabBarIcon: ({ focused }) => <TabIcon label="📷" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
