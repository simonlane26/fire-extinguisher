import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addYears } from 'date-fns';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/theme/useTheme';
import { spacing, radius, fontSize, fontWeight } from '../../src/theme/tokens';
import { getExtinguisher, updateExtinguisher } from '../../src/api/extinguishers';
import { formatType } from '../../src/lib/extinguisherDisplay';
import type { Extinguisher, ExtinguisherCondition } from '../../src/types/api';

// Guided monthly visual-check checklist — this is a client-side aid only.
// The backend has no structural storage for individual checklist items, so
// on submit this gets folded into the inspection's free-text notes.
const CHECKLIST_ITEMS = [
  { label: 'Extinguisher in correct location', key: 'location' },
  { label: 'No obstructions to access', key: 'access' },
  { label: 'Operating instructions visible and legible', key: 'instructions' },
  { label: 'Safety pin and tamper seal intact', key: 'pin_seal' },
  { label: 'No visible damage, corrosion or leakage', key: 'damage' },
  { label: 'Pressure gauge in green zone (if applicable)', key: 'pressure' },
  { label: 'Hose and nozzle in good condition', key: 'hose' },
  { label: 'Service label present and in date', key: 'service_label' },
];

const CONDITIONS: Array<{ key: ExtinguisherCondition; label: string }> = [
  { key: 'Excellent', label: 'Excellent' },
  { key: 'Good', label: 'Good' },
  { key: 'Fair', label: 'Fair' },
  { key: 'Needs Attention', label: 'Needs Attention' },
  { key: 'Out of Service', label: 'Out of Service' },
];

export default function InspectionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [extinguisher, setExtinguisher] = useState<Extinguisher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.key, false])),
  );
  const [condition, setCondition] = useState<ExtinguisherCondition>('Good');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const ext = await getExtinguisher(id!);
        setExtinguisher(ext);
        setCondition(ext.condition);
      } catch (err) {
        Alert.alert('Error', 'Could not load extinguisher details.');
        router.back();
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  function toggleCheck(key: string) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit() {
    const uncheckedCount = Object.values(checklist).filter((v) => !v).length;

    if (uncheckedCount > 0) {
      Alert.alert(
        'Incomplete checklist',
        `${uncheckedCount} item${uncheckedCount > 1 ? 's' : ''} not checked. Submit anyway?`,
        [
          { text: 'Review', style: 'cancel' },
          { text: 'Submit', onPress: doSubmit },
        ],
      );
    } else {
      doSubmit();
    }
  }

  async function doSubmit() {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const failedItems = CHECKLIST_ITEMS.filter((item) => !checklist[item.key]);
      const checklistSummary = failedItems.length > 0
        ? `Checklist: ${CHECKLIST_ITEMS.length - failedItems.length}/${CHECKLIST_ITEMS.length} passed. Flagged: ${failedItems.map((i) => i.label).join('; ')}.`
        : `Checklist: ${CHECKLIST_ITEMS.length}/${CHECKLIST_ITEMS.length} passed.`;
      const combinedNotes = [checklistSummary, notes.trim()].filter(Boolean).join('\n');

      await updateExtinguisher(id!, {
        condition,
        inspector: user?.name ?? 'Mobile inspection',
        notes: combinedNotes,
        lastInspection: now.toISOString(),
        nextInspection: addYears(now, 1).toISOString(),
      });

      Alert.alert('Inspection logged', 'The inspection has been recorded.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to submit inspection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const styles = makeStyles(colors);

  if (isLoading || !extinguisher) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const passedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Asset header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerId}>{extinguisher.id.slice(-8)}</Text>
          <View style={[styles.typeBadge, { backgroundColor: colors.blueBg }]}>
            <Text style={[styles.typeText, { color: colors.blue }]}>
              {formatType(extinguisher.type, extinguisher.capacity)}
            </Text>
          </View>
        </View>
        <Text style={styles.headerLocation}>{extinguisher.location}</Text>
        <Text style={styles.headerDetail}>{extinguisher.building}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${(passedCount / totalCount) * 100}%`,
                backgroundColor: passedCount === totalCount ? colors.green : colors.accent,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {passedCount}/{totalCount}
        </Text>
      </View>

      {/* Checklist */}
      <Text style={styles.sectionTitle}>Inspection Checklist</Text>
      {CHECKLIST_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.checkItem,
            checklist[item.key] && styles.checkItemPassed,
          ]}
          onPress={() => toggleCheck(item.key)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              checklist[item.key] && {
                backgroundColor: colors.green,
                borderColor: colors.green,
              },
            ]}
          >
            {checklist[item.key] && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text
            style={[
              styles.checkLabel,
              checklist[item.key] && styles.checkLabelPassed,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Condition */}
      <Text style={styles.sectionTitle}>Overall Condition</Text>
      <View style={styles.condRow}>
        {CONDITIONS.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[
              styles.condChip,
              condition === c.key && styles.condChipActive,
            ]}
            onPress={() => setCondition(c.key)}
          >
            <Text
              style={[
                styles.condChipText,
                condition === c.key && styles.condChipTextActive,
              ]}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.sectionTitle}>Notes (optional)</Text>
      <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Any additional observations, defects, or follow-up actions..."
        placeholderTextColor={colors.fgTertiary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitText}>Submit Inspection</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: spacing.lg,
    },
    header: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    headerId: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
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
    headerLocation: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.fg,
    },
    headerDetail: {
      fontSize: fontSize.sm,
      color: colors.fgSecondary,
      marginTop: 2,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    progressBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.fgSecondary,
      minWidth: 32,
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.fgSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },
    checkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    checkItemPassed: {
      borderColor: colors.greenBg,
      backgroundColor: colors.greenBg,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: fontWeight.bold,
    },
    checkLabel: {
      flex: 1,
      fontSize: fontSize.base,
      color: colors.fg,
    },
    checkLabelPassed: {
      color: colors.green,
    },
    condRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    condChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    condChipActive: {
      backgroundColor: colors.fg,
      borderColor: colors.fg,
    },
    condChipText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.fgSecondary,
    },
    condChipTextActive: {
      color: colors.surface,
    },
    notesInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.md,
      fontSize: fontSize.base,
      color: colors.fg,
      minHeight: 100,
      marginBottom: spacing.xl,
    },
    submitButton: {
      backgroundColor: colors.accent,
      borderRadius: radius.md,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitDisabled: {
      opacity: 0.6,
    },
    submitText: {
      color: '#FFFFFF',
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
  });
}
