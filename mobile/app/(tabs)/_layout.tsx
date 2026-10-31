import { Tabs } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.fg,
        headerTitleStyle: { fontWeight: '700', fontSize: 17, letterSpacing: -0.3 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.fgTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="today" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan QR',
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="scan" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          tabBarLabel: 'Assets',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="assets" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="more" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

// Simple text-based icons (replace with expo/vector-icons or custom SVGs later)
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const icons: Record<string, string> = {
    today: '📋',
    scan: '📷',
    assets: '🧯',
    more: '⋯',
  };

  const { Text } = require('react-native');
  return <Text style={{ fontSize: size - 4 }}>{icons[name] ?? '•'}</Text>;
}
