import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';
import { spacing, radius, fontSize, fontWeight } from '../../src/theme/tokens';
import { getExtinguisher, getInspections } from '../../src/api/extinguishers';
import { formatType } from '../../src/lib/extinguisherDisplay';
import type { Extinguisher, Inspection, ExtinguisherCondition } from '../../src/types/api';

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [extinguisher, setExtinguisher] = useState<Extinguisher | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ext, insp] = await Promise.all([
          getExtinguisher(id!),
          getInspections(id!),
        ]);
        setExtinguisher(ext);
        setInspections(insp);
      } catch {
        // handle error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const styles = makeStyles(colors);

  if (isLoading || !extinguisher) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.headerId}>{extinguisher.id.slice(-8)}</Text>
          <CondBadge condition={extinguisher.condition} colors={colors} />
        </View>

        <View style={styles.detailGrid}>
          <DetailRow label="Type" value={formatType(extinguisher.type, extinguisher.capacity)} colors={colors} />
          <DetailRow label="Location" value={extinguisher.location} colors={colors} />
          <DetailRow label="Building" value={extinguisher.building} colors={colors} />
          {extinguisher.floor && (
            <DetailRow label="Floor" value={extinguisher.floor} colors={colors} />
          )}
          {extinguisher.serialNumber && (
            <DetailRow label="Serial" value={extinguisher.serialNumber} colors={colors} mono />
          )}
          {extinguisher.lastInspection && (
            <DetailRow
              label="Last Inspection"
              value={new Date(extinguisher.lastInspection).toLocaleDateString('en-GB')}
              colors={colors}
            />
          )}
          {extinguisher.nextInspection && (
            <DetailRow
              label="Next Inspection Due"
              value={new Date(extinguisher.nextInspection).toLocaleDateString('en-GB')}
              colors={colors}
            />
          )}
          {extinguisher.nextMaintenance && (
            <DetailRow
              label="Next Service Due"
              value={new Date(extinguisher.nextMaintenance).toLocaleDateString('en-GB')}
              colors={colors}
            />
          )}
        </View>
      </View>

      {/* Quick action */}
      <TouchableOpacity
        style={styles.inspectButton}
        onPress={() => router.push(`/inspect/${id}`)}
        activeOpacity={0.8}
      >
        <Text style={styles.inspectButtonText}>Log Inspection</Text>
      </TouchableOpacity>

      {/* Inspection history */}
      <Text style={styles.sectionTitle}>Inspection History</Text>
      {inspections.length === 0 ? (
        <Text style={styles.emptyText}>No inspections recorded yet.</Text>
      ) : (
        inspections.map((insp) => (
          <View key={insp.id} style={styles.historyItem}>
            <View style={styles.row}>
              <Text style={styles.historyType}>{insp.serviceType}</Text>
              <Text style={styles.historyDate}>
                {new Date(insp.serviceDate).toLocaleDateString('en-GB')}
              </Text>
            </View>
            <Text style={styles.historyMeta}>
              {insp.condition}{insp.technician ? ` · ${insp.technician}` : ''}
            </Text>
            {insp.notes && (
              <Text style={styles.historyNotes}>{insp.notes}</Text>
            )}
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
  colors,
  mono,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
  mono?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ fontSize: 12, color: colors.fgSecondary }}>{label}</Text>
      <Text
        style={{
          fontSize: 12,
          color: colors.fg,
          fontWeight: '500',
          fontFamily: mono ? (Platform.OS === 'ios' ? 'Menlo' : 'monospace') : undefined,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function CondBadge({
  condition,
  colors,
}: {
  condition: ExtinguisherCondition;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const map: Record<ExtinguisherCondition, { bg: string; fg: string }> = {
    Excellent: { bg: colors.greenBg, fg: colors.green },
    Good: { bg: colors.greenBg, fg: colors.green },
    Fair: { bg: colors.amberBg, fg: colors.amber },
    'Needs Attention': { bg: colors.amberBg, fg: colors.amber },
    'Out of Service': { bg: colors.redBg, fg: colors.red },
  };
  const c = map[condition];
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: c.fg }}>{condition}</Text>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    loading: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, backgroundColor: colors.bg },
    content: { padding: spacing.lg },
    card: {
      backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
      borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    headerId: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.fg,
    },
    detailGrid: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.sm },
    inspectButton: {
      backgroundColor: colors.accent, borderRadius: radius.md,
      paddingVertical: 16, alignItems: 'center', marginBottom: spacing.xl,
    },
    inspectButtonText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: fontWeight.bold },
    sectionTitle: {
      fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgSecondary,
      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm,
    },
    emptyText: { fontSize: fontSize.base, color: colors.fgTertiary, fontStyle: 'italic' },
    historyItem: {
      backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
      marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
    },
    historyType: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fg },
    historyDate: { fontSize: fontSize.sm, color: colors.fgSecondary },
    historyMeta: { fontSize: fontSize.xs, color: colors.fgTertiary, marginTop: 2 },
    historyNotes: { fontSize: fontSize.sm, color: colors.fgSecondary, marginTop: spacing.xs },
  });
}
