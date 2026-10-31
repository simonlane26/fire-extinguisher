import { Stack } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';

export default function InspectLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.fg,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        title: 'Log Inspection',
      }}
    />
  );
}
