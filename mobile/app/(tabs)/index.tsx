import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';
import { spacing, radius, fontSize, fontWeight } from '../../src/theme/tokens';
import { getExtinguishers } from '../../src/api/extinguishers';
import { buildShortIds, formatType, getDueStatus } from '../../src/lib/extinguisherDisplay';
import type { Extinguisher, DueItem } from '../../src/types/api';

export default function TodayScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [jobs, setJobs] = useState<DueItem[]>([]);
  const [shortIds, setShortIds] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const all = await getExtinguishers();
      setShortIds(buildShortIds(all));

      const due: DueItem[] = [];
      for (const ext of all) {
        const status = getDueStatus(ext);
        if (status) {
          due.push({ extinguisher: ext, dueDate: status.dueDate, isOverdue: status.isOverdue, daysOverdue: status.daysOverdue });
        }
      }
      setJobs(due);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }

  const overdueJobs = jobs.filter((j) => j.isOverdue);
  const dueToday = jobs.filter((j) => !j.isOverdue);

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      {/* Summary strip */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: colors.red }]}>
          <Text style={styles.summaryValue}>{overdueJobs.length}</Text>
          <Text style={styles.summaryLabel}>Overdue</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: colors.amber }]}>
          <Text style={styles.summaryValue}>{dueToday.length}</Text>
          <Text style={styles.summaryLabel}>Due Soon</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: colors.green }]}>
          <Text style={styles.summaryValue}>{jobs.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
      </View>

      {/* Job list */}
      <FlatList
        data={[...overdueJobs, ...dueToday]}
        keyExtractor={(item) => item.extinguisher.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>✅</Text>
              <Text style={styles.emptyTitle}>All clear</Text>
              <Text style={styles.emptyText}>
                No inspections due. Pull down to refresh.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.jobCard,
              item.isOverdue && styles.jobCardOverdue,
            ]}
            onPress={() => router.push(`/inspect/${item.extinguisher.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.jobHeader}>
              <View style={styles.jobIdRow}>
                <Text style={styles.jobId}>{shortIds.get(item.extinguisher.id) ?? item.extinguisher.id.slice(-8)}</Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: colors.blueBg },
                  ]}
                >
                  <Text style={[styles.typeText, { color: colors.blue }]}>
                    {formatType(item.extinguisher.type, item.extinguisher.capacity)}
                  </Text>
                </View>
              </View>
              {item.isOverdue && (
                <View style={[styles.overdueBadge, { backgroundColor: colors.redBg }]}>
                  <Text style={[styles.overdueText, { color: colors.red }]}>
                    {item.daysOverdue}d overdue
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.jobLocation}>{item.extinguisher.location}</Text>
            <Text style={styles.jobDetail}>
              {item.extinguisher.building}
              {item.extinguisher.floor ? ` · Floor ${item.extinguisher.floor}` : ''}
            </Text>

            <View style={styles.jobFooter}>
              <Text style={styles.jobSite}>{item.extinguisher.site?.name ?? ''}</Text>
              <Text style={styles.jobAction}>Inspect →</Text>
            </View>
          </TouchableOpacity>
        )}
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
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderLeftWidth: 3,
    },
    summaryValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.fg,
    },
    summaryLabel: {
      fontSize: fontSize.xs,
      color: colors.fgSecondary,
      marginTop: 2,
    },
    list: {
      padding: spacing.lg,
      gap: spacing.sm,
    },
    jobCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    jobCardOverdue: {
      borderColor: colors.red,
      borderWidth: 1,
    },
    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    jobIdRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    jobId: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.fg,
    },
    typeBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    typeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
    },
    overdueBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    overdueText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
    },
    jobLocation: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.fg,
    },
    jobDetail: {
      fontSize: fontSize.sm,
      color: colors.fgSecondary,
      marginTop: 2,
    },
    jobFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    jobSite: {
      fontSize: fontSize.sm,
      color: colors.fgTertiary,
    },
    jobAction: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.accent,
    },
    empty: {
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyIcon: {
      fontSize: 40,
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.fg,
      marginBottom: spacing.xs,
    },
    emptyText: {
      fontSize: fontSize.base,
      color: colors.fgSecondary,
      textAlign: 'center',
    },
  });
}
