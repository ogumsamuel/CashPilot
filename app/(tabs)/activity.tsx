import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { subscribeToTransactions } from '@/src/services/transactions';
import { Transaction } from '@/src/types/transactions';
import { useTheme } from '@/src/theme/ThemeContext';

export default function ActivityScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useFocusEffect(
  useCallback(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    const unsubscribe = subscribeToTransactions(
      user.uid,
      (updatedTransactions) => {
        setTransactions(updatedTransactions);
        setLoading(false);
      },
      (listenerError) => {
        console.error(
          'Activity realtime listener error:',
          listenerError
        );

        setError(true);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user])
);
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const formatAmount = (amount: number) =>
    amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (
    transaction: Transaction
  ): keyof typeof Ionicons.glyphMap => {
    if (transaction.type === 'income') {
      return 'arrow-down-outline';
    }

    switch (transaction.category) {
      case 'Food':
        return 'restaurant-outline';

      case 'Transport':
        return 'car-outline';

      case 'Shopping':
        return 'cart-outline';

      case 'Bills':
        return 'receipt-outline';

      case 'Entertainment':
        return 'game-controller-outline';

      default:
        return 'arrow-up-outline';
    }
  };

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
        <Text
          style={[
            styles.title,
            { color: theme.text },
          ]}
        >
          Activity
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.secondaryText },
          ]}
        >
          Keep track of your income and spending.
        </Text>

        {/* Summary */}
        <View style={styles.summaryRow}>
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
                styles.iconContainer,
                { backgroundColor: theme.iconBackground },
              ]}
            >
              <Ionicons
                name="arrow-down-outline"
                size={20}
                color={theme.income}
              />
            </View>

            <Text
              style={[
                styles.summaryLabel,
                { color: theme.secondaryText },
              ]}
            >
              Income
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: theme.text },
              ]}
            >
              ₦{formatAmount(totalIncome)}
            </Text>
          </View>

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
                styles.iconContainer,
                { backgroundColor: theme.iconBackground },
              ]}
            >
              <Ionicons
                name="arrow-up-outline"
                size={20}
                color={theme.expense}
              />
            </View>

            <Text
              style={[
                styles.summaryLabel,
                { color: theme.secondaryText },
              ]}
            >
              Expenses
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: theme.text },
              ]}
            >
              ₦{formatAmount(totalExpenses)}
            </Text>
          </View>
        </View>

        {/* Transactions */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Recent Transactions
        </Text>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator
              size="small"
              color={theme.primary}
            />

            <Text
              style={[
                styles.stateText,
                { color: theme.secondaryText },
              ]}
            >
              Loading transactions...
            </Text>
          </View>
        ) : error ? (
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
                { backgroundColor: theme.iconBackground },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={theme.danger}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text },
              ]}
            >
              Unable to load transactions
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.secondaryText },
              ]}
            >
              Please check your connection and try again.
            </Text>
          </View>
        ) : transactions.length === 0 ? (
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
                { backgroundColor: theme.iconBackground },
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
              Your income and expenses will appear here
              once you start adding transactions.
            </Text>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {transactions.map((transaction) => {
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
                      name={getTransactionIcon(
                        transaction
                      )}
                      size={21}
                      color={
                        isIncome
                          ? theme.income
                          : theme.expense
                      }
                    />
                  </View>

                  <View style={styles.transactionInfo}>
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
                        { color: theme.secondaryText },
                      ]}
                    >
                      {transaction.category} •{' '}
                      {formatDate(transaction.date)}
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
                    {formatAmount(transaction.amount)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
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

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 26,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },

  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 12,
    marginBottom: 5,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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

  centerState: {
    alignItems: 'center',
    paddingVertical: 35,
  },

  stateText: {
    fontSize: 13,
    marginTop: 10,
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
});