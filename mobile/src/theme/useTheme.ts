import { useColorScheme } from 'react-native';
import { colors, colorsDark } from './tokens';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? colorsDark : colors,
  };
}
