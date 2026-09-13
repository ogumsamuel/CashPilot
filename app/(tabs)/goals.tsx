import { Ionicons } from '@expo/vector-icons';
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import {
  addToGoal,
  createGoal,
  deleteGoal,
  Goal,
  subscribeToGoals,
  updateGoal,
} from '@/src/services/goals';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeContext';

type GoalModalMode = 'create' | 'edit';

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string | null) {
  if (!date) {
    return 'No target date';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'No target date';
  }

  return parsedDate.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<GoalModalMode>('create');

  const [selectedGoal, setSelectedGoal] =
    useState<Goal | null>(null);

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] =
    useState('');
  const [savedAmount, setSavedAmount] =
    useState('');
  const [targetDate, setTargetDate] =
    useState('');

  const [contributionVisible, setContributionVisible] =
    useState(false);

  const [contributionGoal, setContributionGoal] =
    useState<Goal | null>(null);

  const [contributionAmount, setContributionAmount] =
    useState('');

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setGoals([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const unsubscribe = subscribeToGoals(
        user.uid,
        (updatedGoals) => {
          setGoals(updatedGoals);
          setLoading(false);
        },
        (error) => {
          console.error(
            'Goals realtime listener error:',
            error
          );
          setLoading(false);

          Alert.alert(
            'Unable to load goals',
            'Please check your connection and try again.'
          );
        }
      );

      return unsubscribe;
    }, [user])
  );

  const activeGoals = useMemo(
    () =>
      goals.filter(
        (goal) => goal.status === 'active'
      ),
    [goals]
  );

  const completedGoals = useMemo(
    () =>
      goals.filter(
        (goal) => goal.status === 'completed'
      ),
    [goals]
  );

  const totalSaved = useMemo(
    () =>
      goals.reduce(
        (total, goal) =>
          total + goal.savedAmount,
        0
      ),
    [goals]
  );

  function resetGoalForm() {
    setGoalName('');
    setTargetAmount('');
    setSavedAmount('');
    setTargetDate('');
    setSelectedGoal(null);
  }

  function openCreateModal() {
    resetGoalForm();
    setModalMode('create');
    setModalVisible(true);
  }

  function openEditModal(goal: Goal) {
    setSelectedGoal(goal);
    setModalMode('edit');

    setGoalName(goal.name);
    setTargetAmount(
      String(goal.targetAmount)
    );
    setSavedAmount(
      String(goal.savedAmount)
    );
    setTargetDate(
      goal.targetDate
        ? goal.targetDate.slice(0, 10)
        : ''
    );

    setModalVisible(true);
  }

  function closeGoalModal() {
    Keyboard.dismiss();
    setModalVisible(false);
    resetGoalForm();
  }

  async function handleSaveGoal() {
    if (!user) {
      return;
    }

    const trimmedName = goalName.trim();

    const numericTarget =
      Number(targetAmount);

    const numericSaved =
      Number(savedAmount);

    if (!trimmedName) {
      Alert.alert(
        'Goal name required',
        'Please enter a name for your goal.'
      );
      return;
    }

    if (
      !Number.isFinite(numericTarget) ||
      numericTarget <= 0
    ) {
      Alert.alert(
        'Invalid target',
        'Please enter a target amount greater than zero.'
      );
      return;
    }

    if (
      !Number.isFinite(numericSaved) ||
      numericSaved < 0
    ) {
      Alert.alert(
        'Invalid saved amount',
        'Saved amount cannot be negative.'
      );
      return;
    }

    if (numericSaved > numericTarget) {
      Alert.alert(
        'Invalid amount',
        'Saved amount cannot be greater than the target amount.'
      );
      return;
    }

    Keyboard.dismiss();
    setSaving(true);

    try {
      if (
        modalMode === 'edit' &&
        selectedGoal
      ) {
        await updateGoal(
          user.uid,
          selectedGoal.id,
          {
            name: trimmedName,
            targetAmount: numericTarget,
            savedAmount: numericSaved,
            targetDate:
              targetDate.trim()
                ? targetDate.trim()
                : null,
          }
        );
      } else {
        await createGoal(user.uid, {
          name: trimmedName,
          targetAmount: numericTarget,
          savedAmount: numericSaved,
          targetDate:
            targetDate.trim()
              ? targetDate.trim()
              : null,
        });
      }

      closeGoalModal();
    } catch (error) {
      console.error(
        'Failed to save goal:',
        error
      );

      Alert.alert(
        'Unable to save goal',
        'Something went wrong while saving your goal. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  function openContributionModal(goal: Goal) {
    setContributionGoal(goal);
    setContributionAmount('');
    setContributionVisible(true);
  }

  function closeContributionModal() {
    Keyboard.dismiss();
    setContributionVisible(false);
    setContributionGoal(null);
    setContributionAmount('');
  }

  async function handleAddContribution() {
    if (!user || !contributionGoal) {
      return;
    }

    const numericAmount =
      Number(contributionAmount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert(
        'Invalid amount',
        'Please enter an amount greater than zero.'
      );
      return;
    }

    const remaining =
      contributionGoal.targetAmount -
      contributionGoal.savedAmount;

    if (numericAmount > remaining) {
      Alert.alert(
        'Amount too high',
        `You only need ${formatCurrency(
          remaining
        )} to reach this goal.`
      );
      return;
    }

    Keyboard.dismiss();
    setSaving(true);

    try {
      await addToGoal(
        user.uid,
        contributionGoal.id,
        numericAmount,
        contributionGoal.savedAmount,
        contributionGoal.targetAmount
      );

      closeContributionModal();
    } catch (error) {
      console.error(
        'Failed to add goal contribution:',
        error
      );

      Alert.alert(
        'Unable to add contribution',
        'Something went wrong. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  function confirmDeleteGoal(goal: Goal) {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.name}"? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) {
              return;
            }

            try {
              await deleteGoal(
                user.uid,
                goal.id
              );
            } catch (error) {
              console.error(
                'Failed to delete goal:',
                error
              );

              Alert.alert(
                'Unable to delete goal',
                'Something went wrong. Please try again.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text
              style={[
                styles.title,
                { color: theme.text },
              ]}
            >
              Goals
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    theme.secondaryText,
                },
              ]}
            >
              Set goals and build toward your future.
            </Text>
          </View>

          <Pressable
            onPress={openCreateModal}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor:
                  theme.primary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={24}
              color={theme.white}
            />
          </Pressable>
        </View>

        {/* Goals Overview */}
        <View
          style={[
            styles.overviewCard,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <View style={styles.overviewHeader}>
            <View>
              <Text
                style={[
                  styles.overviewLabel,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                Total Saved
              </Text>

              <Text
                style={[
                  styles.overviewAmount,
                  { color: theme.text },
                ]}
              >
                {formatCurrency(totalSaved)}
              </Text>
            </View>

            <View
              style={[
                styles.overviewIcon,
                {
                  backgroundColor:
                    theme.iconBackground,
                },
              ]}
            >
              <Ionicons
                name="flag-outline"
                size={24}
                color={theme.primary}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.text },
                ]}
              >
                {activeGoals.length}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                Active Goals
              </Text>
            </View>

            <View
              style={[
                styles.statDivider,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            />

            <View style={styles.stat}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.text },
                ]}
              >
                {completedGoals.length}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text },
            ]}
          >
            My Goals
          </Text>

          <Text
            style={[
              styles.countText,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            {goals.length}{' '}
            {goals.length === 1
              ? 'goal'
              : 'goals'}
          </Text>
        </View>

        {loading ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  theme.card,
                borderColor:
                  theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    theme.secondaryText,
                },
              ]}
            >
              Loading your goals...
            </Text>
          </View>
        ) : goals.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  theme.card,
                borderColor:
                  theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    theme.iconBackground,
                },
              ]}
            >
              <Ionicons
                name="flag-outline"
                size={30}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text },
              ]}
            >
              No financial goals yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    theme.secondaryText,
                },
              ]}
            >
              Create a savings goal and track your progress
              toward something important to you.
            </Text>

            <Pressable
              onPress={openCreateModal}
              style={({ pressed }) => [
                styles.createButton,
                {
                  backgroundColor:
                    theme.primary,
                  opacity:
                    pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name="add"
                size={18}
                color={theme.white}
              />

              <Text
                style={[
                  styles.createButtonText,
                  { color: theme.white },
                ]}
              >
                Create Goal
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? Math.min(
                      goal.savedAmount /
                        goal.targetAmount,
                      1
                    )
                  : 0;

              const percentage =
                Math.round(
                  progress * 100
                );

              const remaining = Math.max(
                goal.targetAmount -
                  goal.savedAmount,
                0
              );

              return (
                <View
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor:
                        theme.card,
                      borderColor:
                        theme.border,
                    },
                  ]}
                >
                  <View style={styles.goalHeader}>
                    <View
                      style={
                        styles.goalTitleContainer
                      }
                    >
                      <View
                        style={[
                          styles.goalIcon,
                          {
                            backgroundColor:
                              theme.iconBackground,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            goal.status ===
                            'completed'
                              ? 'checkmark'
                              : 'flag-outline'
                          }
                          size={20}
                          color={
                            theme.primary
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.goalTitleContent
                        }
                      >
                        <Text
                          style={[
                            styles.goalName,
                            {
                              color:
                                theme.text,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {goal.name}
                        </Text>

                        <Text
                          style={[
                            styles.goalDate,
                            {
                              color:
                                theme.secondaryText,
                            },
                          ]}
                        >
                          {goal.status ===
                          'completed'
                            ? 'Goal completed'
                            : `Target: ${formatDate(
                                goal.targetDate
                              )}`}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() =>
                        openEditModal(goal)
                      }
                      hitSlop={8}
                    >
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={22}
                        color={
                          theme.secondaryText
                        }
                      />
                    </Pressable>
                  </View>

                  <View
                    style={
                      styles.goalAmountRow
                    }
                  >
                    <View>
                      <Text
                        style={[
                          styles.savedAmount,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                      >
                        {formatCurrency(
                          goal.savedAmount
                        )}
                      </Text>

                      <Text
                        style={[
                          styles.targetAmountText,
                          {
                            color:
                              theme.secondaryText,
                          },
                        ]}
                      >
                        of{' '}
                        {formatCurrency(
                          goal.targetAmount
                        )}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.percentage,
                        {
                          color:
                            theme.primary,
                        },
                      ]}
                    >
                      {percentage}%
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.progressTrack,
                      {
                        backgroundColor:
                          theme.input,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor:
                            theme.primary,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={
                      styles.goalFooter
                    }
                  >
                    <Text
                      style={[
                        styles.remainingText,
                        {
                          color:
                            theme.secondaryText,
                        },
                      ]}
                    >
                      {goal.status ===
                      'completed'
                        ? 'Target reached'
                        : `${formatCurrency(
                            remaining
                          )} remaining`}
                    </Text>

                    {goal.status ===
                      'active' && (
                      <Pressable
                        onPress={() =>
                          openContributionModal(
                            goal
                          )
                        }
                        style={({ pressed }) => [
                          styles.contributeButton,
                          {
                            borderColor:
                              theme.border,
                            opacity:
                              pressed
                                ? 0.7
                                : 1,
                          },
                        ]}
                      >
                        <Ionicons
                          name="add"
                          size={16}
                          color={
                            theme.primary
                          }
                        />

                        <Text
                          style={[
                            styles.contributeText,
                            {
                              color:
                                theme.primary,
                            },
                          ]}
                        >
                          Add Money
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create / Edit Goal Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={
          closeGoalModal
        }
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor:
                  theme.card,
              },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {modalMode ===
                  'create'
                    ? 'Create Goal'
                    : 'Edit Goal'}
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color:
                        theme.secondaryText,
                    },
                  ]}
                >
                  Set a target and track your progress.
                </Text>
              </View>

              <Pressable
                onPress={
                  closeGoalModal
                }
                hitSlop={8}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={
                    theme.secondaryText
                  }
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={
                styles.modalContent
              }
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={
                false
              }
            >
              <Text
                style={[
                  styles.inputLabel,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Goal Name
              </Text>

              <TextInput
                value={goalName}
                onChangeText={
                  setGoalName
                }
                placeholder="e.g. Emergency Fund"
                placeholderTextColor={
                  theme.secondaryText
                }
                style={[
                  styles.input,
                  {
                    color:
                      theme.text,
                    backgroundColor:
                      theme.input,
                    borderColor:
                      theme.border,
                  },
                ]}
                returnKeyType="next"
              />

              <Text
                style={[
                  styles.inputLabel,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Target Amount
              </Text>

              <TextInput
                value={targetAmount}
                onChangeText={
                  setTargetAmount
                }
                placeholder="e.g. 300000"
                placeholderTextColor={
                  theme.secondaryText
                }
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    color:
                      theme.text,
                    backgroundColor:
                      theme.input,
                    borderColor:
                      theme.border,
                  },
                ]}
                returnKeyType="next"
              />

              <Text
                style={[
                  styles.inputLabel,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Already Saved
              </Text>

              <TextInput
                value={savedAmount}
                onChangeText={
                  setSavedAmount
                }
                placeholder="e.g. 50000"
                placeholderTextColor={
                  theme.secondaryText
                }
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    color:
                      theme.text,
                    backgroundColor:
                      theme.input,
                    borderColor:
                      theme.border,
                  },
                ]}
                returnKeyType="next"
              />

              <Text
                style={[
                  styles.inputHint,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                Enter 0 if you are starting from scratch.
              </Text>

              <Text
                style={[
                  styles.inputLabel,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Target Date
              </Text>

              <TextInput
                value={targetDate}
                onChangeText={
                  setTargetDate
                }
                placeholder="YYYY-MM-DD"
                placeholderTextColor={
                  theme.secondaryText
                }
                style={[
                  styles.input,
                  {
                    color:
                      theme.text,
                    backgroundColor:
                      theme.input,
                    borderColor:
                      theme.border,
                  },
                ]}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={() =>
                  Keyboard.dismiss()
                }
              />

              <Text
                style={[
                  styles.inputHint,
                  {
                    color:
                      theme.secondaryText,
                  },
                ]}
              >
                Optional. Example: 2027-06-30
              </Text>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  handleSaveGoal();
                }}
                disabled={saving}
                style={({ pressed }) => [
                  styles.modalPrimaryButton,
                  {
                    backgroundColor:
                      theme.primary,
                    opacity:
                      saving
                        ? 0.5
                        : pressed
                        ? 0.7
                        : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalPrimaryButtonText,
                    {
                      color:
                        theme.white,
                    },
                  ]}
                >
                  {saving
                    ? 'Saving...'
                    : modalMode ===
                      'create'
                    ? 'Create Goal'
                    : 'Save Changes'}
                </Text>
              </Pressable>

              {modalMode ===
                'edit' &&
                selectedGoal && (
                  <Pressable
                    onPress={() => {
                      closeGoalModal();

                      setTimeout(() => {
                        confirmDeleteGoal(
                          selectedGoal
                        );
                      }, 200);
                    }}
                    style={({ pressed }) => [
                      styles.deleteButton,
                      {
                        borderColor:
                          theme.danger,
                        opacity:
                          pressed
                            ? 0.7
                            : 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={
                        theme.danger
                      }
                    />

                    <Text
                      style={[
                        styles.deleteButtonText,
                        {
                          color:
                            theme.danger,
                        },
                      ]}
                    >
                      Delete Goal
                    </Text>
                  </Pressable>
                )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Contribution Modal */}
      <Modal
        visible={
          contributionVisible
        }
        transparent
        animationType="slide"
        onRequestClose={
          closeContributionModal
        }
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
        >
          <View
            style={[
              styles.smallModalCard,
              {
                backgroundColor:
                  theme.card,
              },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Add Money
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color:
                        theme.secondaryText,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {contributionGoal?.name}
                </Text>
              </View>

              <Pressable
                onPress={
                  closeContributionModal
                }
                hitSlop={8}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={
                    theme.secondaryText
                  }
                />
              </Pressable>
            </View>

            <View
              style={styles.modalContent}
            >
              <Text
                style={[
                  styles.inputLabel,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Contribution Amount
              </Text>

              <TextInput
                value={
                  contributionAmount
                }
                onChangeText={
                  setContributionAmount
                }
                placeholder="e.g. 20000"
                placeholderTextColor={
                  theme.secondaryText
                }
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    color:
                      theme.text,
                    backgroundColor:
                      theme.input,
                    borderColor:
                      theme.border,
                  },
                ]}
                returnKeyType="done"
                onSubmitEditing={() =>
                  Keyboard.dismiss()
                }
              />

              {contributionGoal && (
                <View
                  style={[
                    styles.contributionInfo,
                    {
                      backgroundColor:
                        theme.input,
                      borderColor:
                        theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.contributionInfoLabel,
                      {
                        color:
                          theme.secondaryText,
                      },
                    ]}
                  >
                    Remaining to reach goal
                  </Text>

                  <Text
                    style={[
                      styles.contributionInfoAmount,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {formatCurrency(
                      Math.max(
                        contributionGoal.targetAmount -
                          contributionGoal.savedAmount,
                        0
                      )
                    )}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  handleAddContribution();
                }}
                disabled={saving}
                style={({ pressed }) => [
                  styles.modalPrimaryButton,
                  {
                    backgroundColor:
                      theme.primary,
                    opacity:
                      saving
                        ? 0.5
                        : pressed
                        ? 0.7
                        : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalPrimaryButtonText,
                    {
                      color:
                        theme.white,
                    },
                  ]}
                >
                  {saving
                    ? 'Saving...'
                    : 'Add Money'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  headerContent: {
    flex: 1,
    paddingRight: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overviewCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },

  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  overviewLabel: {
    fontSize: 13,
    marginBottom: 6,
  },

  overviewAmount: {
    fontSize: 28,
    fontWeight: '700',
  },

  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },

  stat: {
    flex: 1,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
  },

  statDivider: {
    width: 1,
    height: 38,
    marginHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  countText: {
    fontSize: 12,
  },

  goalsList: {
    gap: 14,
  },

  goalCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  goalTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  goalIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  goalTitleContent: {
    flex: 1,
  },

  goalName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  goalDate: {
    fontSize: 12,
  },

  goalAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  savedAmount: {
    fontSize: 20,
    fontWeight: '700',
  },

  targetAmountText: {
    fontSize: 12,
    marginTop: 3,
  },

  percentage: {
    fontSize: 16,
    fontWeight: '700',
  },

  progressTrack: {
    height: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 8,
  },

  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  remainingText: {
    flex: 1,
    fontSize: 12,
  },

  contributeButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  contributeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  emptyCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 7,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 20,
  },

  createButton: {
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  createButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  modalCard: {
    width: '100%',
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  smallModalCard: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  modalSubtitle: {
    fontSize: 12,
  },

  modalScroll: {
    flexGrow: 0,
  },

  modalContent: {
    padding: 20,
    paddingBottom: 35,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
  },

  inputHint: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: -9,
    marginBottom: 16,
  },

  modalPrimaryButton: {
    minHeight: 50,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  modalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  deleteButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
  },

  deleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  contributionInfo: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },

  contributionInfoLabel: {
    fontSize: 11,
    marginBottom: 4,
  },

  contributionInfoAmount: {
    fontSize: 17,
    fontWeight: '700',
  },
});