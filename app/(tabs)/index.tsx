import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { subscribeToTransactions } from '@/src/services/transactions';
import { useTheme } from '@/src/theme/ThemeContext';
import { Transaction } from '@/src/types/transactions';

function getLastSixMonths() {
  const months: {
    key: string;
    label: string;
  }[] = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      key: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`,
      label: date.toLocaleString('en-US', {
        month: 'short',
      }),
    });
  }

  return months;
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const monthlySpending = getLastSixMonths().map(
  (month) => {
    const total = transactions
      .filter((transaction) => {
        if (transaction.type !== 'expense') {
          return false;
        }

        const transactionDate = new Date(
          transaction.date
        );

        const transactionMonth = `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1
        ).padStart(2, '0')}`;

        return transactionMonth === month.key;
      })
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0
      );

    return {
      ...month,
      amount: total,
    };
  }
);
  
const highestMonthlySpending = Math.max(
  ...monthlySpending.map((month) => month.amount),
  1
);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setTransactions([]);
        setTotalIncome(0);
        setTotalExpenses(0);
        setBalance(0);
        return;
      }

      const unsubscribe = subscribeToTransactions(
        user.uid,
        (updatedTransactions) => {
          setTransactions(updatedTransactions);

          const income = updatedTransactions
            .filter(
              (transaction) =>
                transaction.type === 'income'
            )
            .reduce(
              (total, transaction) =>
                total + transaction.amount,
              0
            );

          const expenses = updatedTransactions
            .filter(
              (transaction) =>
                transaction.type === 'expense'
            )
            .reduce(
              (total, transaction) =>
                total + transaction.amount,
              0
            );

          setTotalIncome(income);
          setTotalExpenses(expenses);
          setBalance(income - expenses);
        },
        (error) => {
          console.error(
            'Home realtime listener error:',
            error
          );
        }
      );

      return unsubscribe;
    }, [user])
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.greeting,
                { color: theme.secondaryText },
              ]}
            >
              Welcome back
            </Text>

            <Text
              style={[
                styles.userName,
                { color: theme.text },
              ]}
            >
              Samuel
            </Text>
          </View>

          <Pressable
            style={[
              styles.notificationButton,
              { backgroundColor: theme.iconBackground },
            ]}
            onPress={() => {}}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.primary}
            />
          </Pressable>
        </View>

        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            { backgroundColor: theme.primary },
          ]}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>
                Total balance
              </Text>

              <Text style={styles.balanceAmount}>
                ₦
                {balance.toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View style={styles.balanceIcon}>
              <Ionicons
                name="wallet-outline"
                size={24}
                color={theme.white}
              />
            </View>
          </View>

          <View style={styles.balanceFooter}>
            <View>
              <Text style={styles.balanceSmallLabel}>
                Available balance
              </Text>

              <Text style={styles.balanceSmallAmount}>
                ₦
                {balance.toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>

            <Ionicons
              name="arrow-up-circle-outline"
              size={24}
              color={theme.white}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text },
            ]}
          >
            Quick actions
          </Text>
        </View>

        <View style={styles.quickActions}>
          <QuickAction
            icon="add-circle-outline"
            label="Add income"
            theme={theme}
            onPress={() =>
              router.push('/add-transaction')
            }
          />

          <QuickAction
            icon="remove-circle-outline"
            label="Add expense"
            theme={theme}
            onPress={() =>
              router.push('/add-transaction')
            }
          />

          <QuickAction
            icon="swap-horizontal-outline"
            label="Transfer"
            theme={theme}
            onPress={() => {}}
          />

          <QuickAction
            icon="flag-outline"
            label="New goal"
            theme={theme}
            onPress={() => {}}
          />
        </View>

        {/* Cash Flow */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text },
            ]}
          >
            Cash flow
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard
            title="Income"
            amount={`₦${totalIncome.toLocaleString(
              'en-NG',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
            icon="arrow-down"
            iconColor={theme.income}
            theme={theme}
          />

          <SummaryCard
            title="Expenses"
            amount={`₦${totalExpenses.toLocaleString(
              'en-NG',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
            icon="arrow-up"
            iconColor={theme.expense}
            theme={theme}
          />
        </View>
      
      {/* Spending Overview */}
<View style={styles.sectionHeader}>
  <Text
    style={[
      styles.sectionTitle,
      { color: theme.text },
    ]}
  >
    Spending overview
  </Text>

  <Pressable onPress={() => {}}>
    <Text
      style={[
        styles.viewText,
        { color: theme.primary },
      ]}
    >
      View report
    </Text>
  </Pressable>
</View>

<View
  style={[
    styles.chartCard,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },
  ]}
>
  <View style={styles.chartHeader}>
    <View>
      <Text
        style={[
          styles.chartAmount,
          { color: theme.text },
        ]}
      >
        ₦
        {totalExpenses.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>

      <Text
        style={[
          styles.chartSubtext,
          { color: theme.secondaryText },
        ]}
      >
        Total spending
      </Text>
    </View>

    <View
      style={[
        styles.periodBadge,
        {
          backgroundColor:
            theme.iconBackground,
        },
      ]}
    >
      <Text
        style={[
          styles.periodText,
          { color: theme.primary },
        ]}
      >
        6 months
      </Text>
    </View>
  </View>

  <View style={styles.chartArea}>
    <View style={styles.chartBars}>
      {monthlySpending.map((month) => {
        const barHeight =
          month.amount === 0
            ? 4
            : Math.max(
                (month.amount /
                  highestMonthlySpending) *
                  150,
                12
              );

        return (
          <View
            key={month.key}
            style={styles.chartColumn}
          >
            <View
              style={[
                styles.chartBarBackground,
                {
                  backgroundColor:
                    theme.iconBackground,
                },
              ]}
            >
              <View
                style={[
                  styles.chartBar,
                  {
                    height: barHeight,
                    backgroundColor:
                      theme.primary,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.chartMonth,
                { color: theme.secondaryText },
              ]}
            >
              {month.label}
            </Text>
          </View>
        );
      })}
    </View>
  </View>
</View>

        {/* Recent Transactions */}
        <View>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              Recent Transactions
            </Text>

            {transactions.length > 0 && (
              <Pressable
                onPress={() =>
                  router.push('/activity')
                }
              >
                <Text
                  style={[
                    styles.viewAllText,
                    { color: theme.primary },
                  ]}
                >
                  View all
                </Text>
              </Pressable>
            )}
          </View>

          {transactions.length === 0 ? (
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
                  name="receipt-outline"
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
                No transactions yet
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  { color: theme.secondaryText },
                ]}
              >
                Your recent income and expenses will
                appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.transactionList}>
              {transactions
                .slice(0, 5)
                .map((transaction) => {
                  const isIncome =
                    transaction.type === 'income';

                  return (
                    <View
                      key={transaction.id}
                      style={[
                        styles.transactionCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.transactionIcon,
                          {
                            backgroundColor:
                              theme.iconBackground,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            isIncome
                              ? 'arrow-down-outline'
                              : 'arrow-up-outline'
                          }
                          size={21}
                          color={
                            isIncome
                              ? theme.income
                              : theme.expense
                          }
                        />
                      </View>

                      <View
                        style={styles.transactionInfo}
                      >
                        <Text
                          style={[
                            styles.transactionDescription,
                            { color: theme.text },
                          ]}
                          numberOfLines={1}
                        >
                          {transaction.description ||
                            transaction.category}
                        </Text>

                        <Text
                          style={[
                            styles.transactionMeta,
                            {
                              color:
                                theme.secondaryText,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {transaction.category}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.transactionAmount,
                          {
                            color: isIncome
                              ? theme.income
                              : theme.expense,
                          },
                        ]}
                      >
                        {isIncome ? '+' : '-'}₦
                        {transaction.amount.toLocaleString(
                          'en-NG',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Text>
                    </View>
                  );
                })}
            </View>
          )}

          <Pressable
            style={[
              styles.addTransactionButton,
              { backgroundColor: theme.primary },
            ]}
            onPress={() =>
              router.push('/add-transaction')
            }
          >
            <Ionicons
              name="add"
              size={18}
              color={theme.white}
            />

            <Text
              style={[
                styles.addTransactionText,
                { color: theme.white },
              ]}
            >
              Add transaction
            </Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function QuickAction({
  icon,
  label,
  theme,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  theme: Theme;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={onPress}
    >
      <View
        style={[
          styles.quickActionIcon,
          {
            backgroundColor:
              theme.iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={theme.primary}
        />
      </View>

      <Text
        style={[
          styles.quickActionLabel,
          { color: theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SummaryCard({
  title,
  amount,
  icon,
  iconColor,
  theme,
}: {
  title: string;
  amount: string;
  icon: 'arrow-down' | 'arrow-up';
  iconColor: string;
  theme: Theme;
}) {
  return (
    <View
      style={[
        styles.summaryCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.summaryIcon,
          {
            backgroundColor:
              theme.iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={iconColor}
        />
      </View>

      <Text
        style={[
          styles.summaryTitle,
          { color: theme.secondaryText },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.summaryAmount,
          { color: theme.text },
        ]}
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

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    marginBottom: 3,
  },

  userName: {
    fontSize: 28,
    fontWeight: '700',
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },

  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  balanceLabel: {
    color: '#C8D9CD',
    fontSize: 14,
    marginBottom: 7,
  },

  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },

  balanceIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceFooter: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceSmallLabel: {
    color: '#C8D9CD',
    fontSize: 12,
    marginBottom: 3,
  },

  balanceSmallAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  viewText: {
    fontSize: 13,
    fontWeight: '700',
  },

  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  quickAction: {
    alignItems: 'center',
    width: '23%',
  },

  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  summaryCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },

  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  summaryTitle: {
    fontSize: 12,
    marginBottom: 5,
  },

  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },

  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 28,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  chartAmount: {
    fontSize: 22,
    fontWeight: '700',
  },

  chartSubtext: {
    fontSize: 12,
    marginTop: 4,
  },

  periodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  periodText: {
    fontSize: 11,
    fontWeight: '700',
  },

  chartArea: {
  height: 190,
  marginTop: 20,
  justifyContent: 'flex-end',
},

chartBars: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  paddingHorizontal: 4,
},

chartColumn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginHorizontal: 4,
},

chartBarBackground: {
  width: 28,
  height: 150,
  borderRadius: 14,
  justifyContent: 'flex-end',
  overflow: 'hidden',
},

chartBar: {
  width: '100%',
  borderRadius: 14,
},

chartMonth: {
  marginTop: 9,
  fontSize: 11,
  fontWeight: '600',
},
  emptyTransactions: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
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
  },

  transactionList: {
    gap: 10,
  },

  transactionCard: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  transactionInfo: {
    flex: 1,
    marginRight: 10,
  },

  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },

  transactionMeta: {
    fontSize: 11,
  },

  transactionAmount: {
    fontSize: 13,
    fontWeight: '700',
  },

  addTransactionButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  addTransactionText: {
    fontSize: 13,
    fontWeight: '700',
  },

  bottomSpacing: {
    height: 30,
  },
});