import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  InputAccessoryView,
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

import { useAuth } from '@/src/context/AuthContext';
import {
  Budget,
  saveBudget,
  subscribeToBudgets,
} from '@/src/services/budgets';
import { subscribeToTransactions } from '@/src/services/transactions';
import { useTheme } from '@/src/theme/ThemeContext';
import {
  Transaction,
  TransactionCategory,
} from '@/src/types/transactions';

const BUDGET_CATEGORIES: TransactionCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
];

const CATEGORY_ICONS: Record<
  TransactionCategory,
  keyof typeof Ionicons.glyphMap
> = {
  Food: 'restaurant-outline',
  Transport: 'car-outline',
  Shopping: 'bag-handle-outline',
  Bills: 'receipt-outline',
  Entertainment: 'game-controller-outline',
  Salary: 'cash-outline',
  Other: 'ellipsis-horizontal-circle-outline',
};

export default function BudgetsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory | null>(null);

  const [limitInput, setLimitInput] =
    useState('');

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setTransactions([]);
        setBudgets([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const unsubscribeTransactions =
        subscribeToTransactions(
          user.uid,
          (updatedTransactions) => {
            setTransactions(updatedTransactions);
            setLoading(false);
          },
          (error) => {
            console.error(
              'Budgets transaction listener error:',
              error
            );
            setLoading(false);
          }
        );

      const unsubscribeBudgets =
        subscribeToBudgets(
          user.uid,
          (updatedBudgets) => {
            setBudgets(updatedBudgets);
          },
          (error) => {
            console.error(
              'Budgets listener error:',
              error
            );
          }
        );

      return () => {
        unsubscribeTransactions();
        unsubscribeBudgets();
      };
    }, [user])
  );

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      if (transaction.type !== 'expense') {
        return false;
      }

      const transactionDate = new Date(
        transaction.date
      );

      return (
        transactionDate.getFullYear() ===
          now.getFullYear() &&
        transactionDate.getMonth() === now.getMonth()
      );
    });
  }, [transactions]);

  const categorySpending = useMemo(() => {
    const spending: Record<
      TransactionCategory,
      number
    > = {
      Food: 0,
      Transport: 0,
      Shopping: 0,
      Bills: 0,
      Entertainment: 0,
      Salary: 0,
      Other: 0,
    };

    currentMonthTransactions.forEach(
      (transaction) => {
        spending[transaction.category] +=
          transaction.amount;
      }
    );

    return spending;
  }, [currentMonthTransactions]);

  const budgetLimits = useMemo(() => {
    const limits: Record<
      TransactionCategory,
      number
    > = {
      Food: 0,
      Transport: 0,
      Shopping: 0,
      Bills: 0,
      Entertainment: 0,
      Salary: 0,
      Other: 0,
    };

    budgets.forEach((budget) => {
      if (
        budget.category in limits
      ) {
        limits[
          budget.category as TransactionCategory
        ] = budget.monthlyLimit;
      }
    });

    return limits;
  }, [budgets]);

  const totalBudget = useMemo(() => {
    return BUDGET_CATEGORIES.reduce(
      (total, category) =>
        total + budgetLimits[category],
      0
    );
  }, [budgetLimits]);

  const totalSpent = useMemo(() => {
    return currentMonthTransactions.reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );
  }, [currentMonthTransactions]);

  const remainingBudget =
    totalBudget - totalSpent;

  const overallPercentage =
    totalBudget > 0
      ? Math.min(
          (totalSpent / totalBudget) * 100,
          100
        )
      : 0;

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const monthName = new Date().toLocaleString(
    'en-US',
    {
      month: 'long',
    }
  );

  const openBudgetModal = (
    category?: TransactionCategory
  ) => {
    if (category) {
      const existingBudget =
        budgets.find(
          (budget) =>
            budget.category === category
        );

      setSelectedCategory(category);

      setLimitInput(
        existingBudget
          ? String(existingBudget.monthlyLimit)
          : ''
      );
    } else {
      setSelectedCategory(null);
      setLimitInput('');
    }

    setModalVisible(true);
  };

  const closeBudgetModal = () => {
    if (saving) {
      return;
    }

    setModalVisible(false);
    setSelectedCategory(null);
    setLimitInput('');
  };

  const handleSaveBudget = async () => {
    if (!user || !selectedCategory) {
      return;
    }

    const numericLimit = Number(
      limitInput.replace(/,/g, '').trim()
    );

    if (
      !Number.isFinite(numericLimit) ||
      numericLimit <= 0
    ) {
      return;
    }

    try {
      setSaving(true);

      await saveBudget(
        user.uid,
        selectedCategory,
        numericLimit
      );

      closeBudgetModal();
    } catch (error) {
      console.error(
        'Failed to save budget:',
        error
      );
    } finally {
      setSaving(false);
    }
  };

  const configuredCategories =
    BUDGET_CATEGORIES.filter((category) =>
      budgets.some(
        (budget) =>
          budget.category === category
      )
    );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
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
              Budgets
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.secondaryText },
              ]}
            >
              Plan your spending and stay on track.
            </Text>
          </View>

          <Pressable
            onPress={() => openBudgetModal()}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: theme.primary,
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

        {/* Overall Budget */}
        <View
          style={[
            styles.overviewCard,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <View style={styles.overviewTop}>
            <View>
              <Text
                style={[
                  styles.overviewLabel,
                  { color: theme.white },
                ]}
              >
                {monthName} Budget
              </Text>

              <Text
                style={[
                  styles.overviewAmount,
                  { color: theme.white },
                ]}
              >
                {formatCurrency(totalBudget)}
              </Text>
            </View>

            <View
              style={[
                styles.overviewIcon,
                {
                  backgroundColor:
                    theme.primaryLight,
                },
              ]}
            >
              <Ionicons
                name="pie-chart-outline"
                size={24}
                color={theme.primary}
              />
            </View>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor:
                    totalSpent > totalBudget
                      ? theme.danger
                      : theme.white,
                  width: `${overallPercentage}%`,
                },
              ]}
            />
          </View>

          <View style={styles.overviewFooterRow}>
            <Text
              style={[
                styles.overviewFooter,
                { color: theme.white },
              ]}
            >
              {formatCurrency(totalSpent)} spent
            </Text>

            <Text
              style={[
                styles.overviewFooter,
                { color: theme.white },
              ]}
            >
              {totalSpent > totalBudget
                ? `${formatCurrency(
                    Math.abs(remainingBudget)
                  )} over`
                : `${formatCurrency(
                    remainingBudget
                  )} remaining`}
            </Text>
          </View>
        </View>

        {/* Budget Summary */}
        <View style={styles.summaryRow}>
          <SummaryItem
            label="Budget"
            amount={formatCurrency(totalBudget)}
            icon="wallet-outline"
            theme={theme}
          />

          <SummaryItem
            label="Spent"
            amount={formatCurrency(totalSpent)}
            icon="trending-up-outline"
            theme={theme}
          />

          <SummaryItem
            label={
              remainingBudget >= 0
                ? 'Remaining'
                : 'Over'
            }
            amount={formatCurrency(
              Math.abs(remainingBudget)
            )}
            icon={
              remainingBudget >= 0
                ? 'checkmark-circle-outline'
                : 'warning-outline'
            }
            theme={theme}
            amountColor={
              remainingBudget >= 0
                ? theme.income
                : theme.expense
            }
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              Budget Categories
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Your spending this month
            </Text>
          </View>

          <Text
            style={[
              styles.countText,
              { color: theme.secondaryText },
            ]}
          >
            {configuredCategories.length}{' '}
            budgets
          </Text>
        </View>

        {loading ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={28}
              color={theme.primary}
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.text,
                  marginTop: 12,
                },
              ]}
            >
              Loading budgets
            </Text>
          </View>
        ) : budgets.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
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
                name="wallet-outline"
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
              No budgets yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.secondaryText },
              ]}
            >
              Create a budget to control your
              spending and stay on track.
            </Text>

            <Pressable
              onPress={() =>
                openBudgetModal()
              }
              style={({ pressed }) => [
                styles.createButton,
                {
                  backgroundColor:
                    theme.primary,
                  opacity: pressed ? 0.7 : 1,
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
                Create Budget
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.categoryList}>
            {BUDGET_CATEGORIES.map(
              (category) => {
                const budget =
                  budgetLimits[category];

                if (budget <= 0) {
                  return null;
                }

                const spent =
                  categorySpending[category];

                const percentage =
                  budget > 0
                    ? (spent / budget) * 100
                    : 0;

                const progressWidth =
                  Math.min(percentage, 100);

                const remaining =
                  budget - spent;

                const isOverBudget =
                  spent > budget;

                return (
                  <Pressable
                    key={category}
                    onPress={() =>
                      openBudgetModal(category)
                    }
                    style={({ pressed }) => [
                      styles.categoryCard,
                      {
                        backgroundColor:
                          theme.card,
                        borderColor:
                          theme.border,
                        opacity: pressed
                          ? 0.8
                          : 1,
                      },
                    ]}
                  >
                    <View
                      style={styles.categoryTop}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          {
                            backgroundColor:
                              theme.iconBackground,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            CATEGORY_ICONS[
                              category
                            ]
                          }
                          size={21}
                          color={theme.primary}
                        />
                      </View>

                      <View
                        style={
                          styles.categoryInfo
                        }
                      >
                        <Text
                          style={[
                            styles.categoryName,
                            {
                              color:
                                theme.text,
                            },
                          ]}
                        >
                          {category}
                        </Text>

                        <Text
                          style={[
                            styles.categoryAmount,
                            {
                              color:
                                theme.secondaryText,
                            },
                          ]}
                        >
                          {formatCurrency(
                            spent
                          )}{' '}
                          of{' '}
                          {formatCurrency(
                            budget
                          )}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.categoryPercentage,
                          {
                            color:
                              isOverBudget
                                ? theme.expense
                                : theme.primary,
                          },
                        ]}
                      >
                        {Math.round(
                          percentage
                        )}
                        %
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.categoryProgressBackground,
                        {
                          backgroundColor:
                            theme.iconBackground,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryProgressFill,
                          {
                            width: `${progressWidth}%`,
                            backgroundColor:
                              isOverBudget
                                ? theme.expense
                                : theme.primary,
                          },
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.categoryFooter
                      }
                    >
                      <Text
                        style={[
                          styles.categoryFooterText,
                          {
                            color:
                              isOverBudget
                                ? theme.expense
                                : theme.secondaryText,
                          },
                        ]}
                      >
                        {isOverBudget
                          ? `${formatCurrency(
                              Math.abs(
                                remaining
                              )
                            )} over budget`
                          : `${formatCurrency(
                              remaining
                            )} remaining`}
                      </Text>

                      <Text
                        style={[
                          styles.editHint,
                          {
                            color:
                              theme.secondaryText,
                          },
                        ]}
                      >
                        Tap to edit
                      </Text>
                    </View>
                  </Pressable>
                );
              }
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Create / Edit Budget Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeBudgetModal}
      >    
       <KeyboardAvoidingView
  style={styles.modalOverlay}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
   <View
  style={[
    styles.modalCard,
    {
      backgroundColor: theme.card,
    },
  ]}
>
  <ScrollView
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.modalContent}
  > 
  </ScrollView>
            <View style={styles.modalHeader}>
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: theme.text },
                  ]}
                >
                  {selectedCategory
                    ? 'Edit Budget'
                    : 'Create Budget'}
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
                  Set your monthly spending limit.
                </Text>
              </View>
            
              <Pressable
                onPress={closeBudgetModal}
                disabled={saving}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor:
                      theme.iconBackground,
                  },
                ]}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={theme.text}
                />
              </Pressable>
            </View>

            <Text
              style={[
                styles.inputLabel,
                { color: theme.text },
              ]}
            >
              Category
            </Text>

            <View style={styles.categoryOptions}>
              {BUDGET_CATEGORIES.map(
                (category) => {
                  const selected =
                    selectedCategory ===
                    category;

                  return (
                    <Pressable
                      key={category}
                      onPress={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      disabled={saving}
                      style={[
                        styles.categoryOption,
                        {
                          backgroundColor:
                            selected
                              ? theme.primary
                              : theme.input,
                          borderColor:
                            selected
                              ? theme.primary
                              : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          {
                            color: selected
                              ? theme.white
                              : theme.text,
                          },
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>

            <Text
              style={[
                styles.inputLabel,
                { color: theme.text },
              ]}
            >
              Monthly limit
            </Text>

            <View
              style={[
                styles.amountInputContainer,
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
                  styles.currencyPrefix,
                  { color: theme.secondaryText },
                ]}
              >
                ₦
              </Text>
            <TextInput
  value={limitInput}
  onChangeText={setLimitInput}
  placeholder="e.g. 30000"
  placeholderTextColor={
    theme.secondaryText
  }
  keyboardType="numeric"
  editable={!saving}
  returnKeyType="done"
  inputAccessoryViewID="budgetAmountKeyboard"
  style={[
    styles.amountInput,
    { color: theme.text },
  ]}
/>

{Platform.OS === 'ios' && (
  <InputAccessoryView nativeID="budgetAmountKeyboard">
    <View
      style={[
        styles.keyboardAccessory,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      ]}
    >
      <Pressable
        onPress={Keyboard.dismiss}
        style={styles.keyboardDoneButton}
      >
        <Text
          style={[
            styles.keyboardDoneText,
            { color: theme.primary },
          ]}
        >
          Done
        </Text>
      </Pressable>
    </View>
  </InputAccessoryView>
)}
   </View>
            <Pressable
              onPress={() => {
             Keyboard.dismiss();
             handleSaveBudget();
              }}
              disabled={
                saving ||
                !selectedCategory ||
                !limitInput.trim()
              }
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor:
                    theme.primary,
                  opacity:
                    saving ||
                    !selectedCategory ||
                    !limitInput.trim()
                      ? 0.5
                      : pressed
                        ? 0.7
                        : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  { color: theme.white },
                ]}
              >
                {saving
                  ? 'Saving...'
                  : selectedCategory &&
                      budgets.some(
                        (budget) =>
                          budget.category ===
                          selectedCategory
                      )
                    ? 'Update Budget'
                    : 'Save Budget'}
              </Text>
            </Pressable>
          </View>
          </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function SummaryItem({
  label,
  amount,
  icon,
  theme,
  amountColor,
}: {
  label: string;
  amount: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme: Theme;
  amountColor?: string;
}) {
  return (
    <View
      style={[
        styles.summaryItem,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={theme.primary}
      />

      <Text
        style={[
          styles.summaryLabel,
          { color: theme.secondaryText },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.summaryAmount,
          {
            color:
              amountColor ?? theme.text,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {amount}
      </Text>
    </View>
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  overviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  overviewLabel: {
    fontSize: 13,
    opacity: 0.85,
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

  progressBackground: {
    height: 7,
    borderRadius: 4,
    backgroundColor:
      'rgba(255,255,255,0.25)',
    marginTop: 22,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  overviewFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  overviewFooter: {
    fontSize: 12,
    opacity: 0.85,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },

  summaryItem: {
    flex: 1,
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
  },

  summaryLabel: {
    fontSize: 11,
    marginTop: 8,
    marginBottom: 4,
  },

  summaryAmount: {
    fontSize: 13,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  countText: {
    fontSize: 12,
  },

  categoryList: {
    gap: 12,
  },

  categoryCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  categoryTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  categoryAmount: {
    fontSize: 11,
  },

  categoryPercentage: {
    fontSize: 13,
    fontWeight: '700',
  },

  categoryProgressBackground: {
    height: 7,
    borderRadius: 4,
    marginTop: 15,
    overflow: 'hidden',
  },

  categoryProgressFill: {
    height: '100%',
    borderRadius: 4,
  },

  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  categoryFooterText: {
    fontSize: 11,
    fontWeight: '600',
  },

  editHint: {
    fontSize: 10,
    fontWeight: '600',
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
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
modalCard: {
  width: '100%',
  maxWidth: 420,
  borderRadius: 20,
  padding: 20,
  maxHeight: '80%',
},

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },

  modalSubtitle: {
    fontSize: 12,
  },
  modalContent: {
  paddingBottom: 10,
},

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },

  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },

  categoryOption: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },

  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },

  amountInputContainer: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 22,
  },

  currencyPrefix: {
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  bottomSpacing: {
    height: 30,
  },

  keyboardAccessory: {
  height: 44,
  borderTopWidth: 1,
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingHorizontal: 16,
},

keyboardDoneButton: {
  paddingHorizontal: 8,
  paddingVertical: 6,
},

keyboardDoneText: {
  fontSize: 15,
  fontWeight: '700',
},
});