import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/theme/useTheme';
import { spacing, radius, fontSize, fontWeight } from '../../src/theme/tokens';

export default function MoreScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      {/* User card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userOrg}>{user?.tenant?.companyName}</Text>
          <Text style={styles.userRole}>{user?.role}</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.section}>
        <MenuItem label="Calendar" icon="📅" colors={colors} />
        <MenuItem label="Reports" icon="📄" colors={colors} />
        <MenuItem label="Sites" icon="🏢" colors={colors} />
        <MenuItem label="QR Codes" icon="📱" colors={colors} />
      </View>

      <View style={styles.section}>
        <MenuItem label="Settings" icon="⚙️" colors={colors} />
        <MenuItem label="Help & Support" icon="❓" colors={colors} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={[styles.logoutText, { color: colors.red }]}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>FireXCheck v1.0.0 · IgnisTech Ltd</Text>
    </View>
  );
}

function MenuItem({
  label,
  icon,
  colors,
}: {
  label: string;
  icon: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const styles = makeStyles(colors);
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    userName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.fg,
    },
    userOrg: {
      fontSize: fontSize.sm,
      color: colors.fgSecondary,
      marginTop: 1,
    },
    userRole: {
      fontSize: fontSize.xs,
      color: colors.fgTertiary,
      marginTop: 1,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    menuIcon: {
      fontSize: 18,
      marginRight: spacing.md,
    },
    menuLabel: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.fg,
      fontWeight: fontWeight.medium,
    },
    menuArrow: {
      fontSize: 20,
      color: colors.fgTertiary,
    },
    logoutButton: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoutText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    version: {
      textAlign: 'center',
      fontSize: fontSize.xs,
      color: colors.fgTertiary,
      marginTop: spacing.xl,
    },
  });
}
