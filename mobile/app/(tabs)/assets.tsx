import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';
import { spacing, radius, fontSize, fontWeight } from '../../src/theme/tokens';
import { getExtinguishers } from '../../src/api/extinguishers';
import { buildShortIds, formatType, getDueStatus } from '../../src/lib/extinguisherDisplay';
import type { Extinguisher, ExtinguisherCondition } from '../../src/types/api';

const CONDITION_FILTERS: Array<{ key: ExtinguisherCondition | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'Excellent', label: 'Excellent' },
  { key: 'Good', label: 'Good' },
  { key: 'Fair', label: 'Fair' },
  { key: 'Needs Attention', label: 'Attention' },
  { key: 'Out of Service', label: 'Out of Service' },
];

export default function AssetsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [allExtinguishers, setAllExtinguishers] = useState<Extinguisher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ExtinguisherCondition | 'ALL'>('ALL');

  const fetchData = useCallback(async () => {
    try {
      const all = await getExtinguishers();
      setAllExtinguishers(all);
    } catch (err) {
      console.error('Failed to fetch extinguishers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  const shortIds = useMemo(() => buildShortIds(allExtinguishers), [allExtinguishers]);

  const extinguishers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allExtinguishers.filter((ext) => {
      if (filter !== 'ALL' && ext.condition !== filter) return false;
      if (!term) return true;
      const shortId = shortIds.get(ext.id) ?? '';
      return (
        ext.location.toLowerCase().includes(term) ||
        ext.building.toLowerCase().includes(term) ||
        ext.type.toLowerCase().includes(term) ||
        shortId.toLowerCase().includes(term)
      );
    });
  }, [allExtinguishers, filter, search, shortIds]);

  const styles = makeStyles(colors);

  function conditionColor(condition: ExtinguisherCondition) {
    switch (condition) {
      case 'Excellent':
      case 'Good':
        return colors.green;
      case 'Fair':
      case 'Needs Attention':
        return colors.amber;
      case 'Out of Service':
        return colors.red;
    }
  }

  function conditionBg(condition: ExtinguisherCondition) {
    switch (condition) {
      case 'Excellent':
      case 'Good':
        return colors.greenBg;
      case 'Fair':
      case 'Needs Attention':
        return colors.amberBg;
      case 'Out of Service':
        return colors.redBg;
    }
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by location, type, ID..."
          placeholderTextColor={colors.fgTertiary}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chipRow}>
        {CONDITION_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.chip,
              filter === f.key && styles.chipActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.chipText,
                filter === f.key && styles.chipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={extinguishers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => {
          const due = getDueStatus(item);
          return (
            <TouchableOpacity
              style={[
                styles.card,
                { borderLeftColor: conditionColor(item.condition) },
              ]}
              onPress={() => router.push(`/assets/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>{shortIds.get(item.id) ?? item.id.slice(-8)}</Text>
                <View
                  style={[
                    styles.condBadge,
                    { backgroundColor: conditionBg(item.condition) },
                  ]}
                >
                  <Text style={[styles.condText, { color: conditionColor(item.condition) }]}>
                    {item.condition}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardLocation}>{item.location}</Text>
              <Text style={styles.cardDetail}>
                {item.building}{item.site?.name ? ` · ${item.site.name}` : ''}
              </Text>

              <View style={styles.cardMeta}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>
                    {formatType(item.type, item.capacity)}
                  </Text>
                </View>
                {due && (
                  <Text style={[styles.metaDate, due.isOverdue && { color: colors.red, fontWeight: fontWeight.semibold }]}>
                    {due.isOverdue ? `${due.daysOverdue}d overdue` : `Due: ${new Date(due.dueDate).toLocaleDateString('en-GB')}`}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    searchWrap: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: 10,
      fontSize: fontSize.base,
      color: colors.fg,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipActive: {
      backgroundColor: colors.fg,
      borderColor: colors.fg,
    },
    chipText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.fgSecondary,
    },
    chipTextActive: {
      color: colors.surface,
    },
    list: {
      padding: spacing.lg,
      gap: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    cardId: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.fg,
      letterSpacing: -0.3,
    },
    condBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radius.sm,
    },
    condText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
    },
    cardLocation: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.fg,
    },
    cardDetail: {
      fontSize: fontSize.sm,
      color: colors.fgSecondary,
      marginTop: 2,
    },
    cardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    typeBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: colors.blueBg,
    },
    typeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.blue,
    },
    metaDate: {
      fontSize: fontSize.xs,
      color: colors.fgTertiary,
    },
  });
}
