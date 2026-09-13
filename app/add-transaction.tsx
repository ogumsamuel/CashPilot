import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/src/context/AuthContext";
import { addTransaction } from "@/src/services/transactions";
import { useTheme } from "@/src/theme/ThemeContext";
import {
  TransactionCategory,
  TransactionType
} from "../src/types/transactions";

const categories: TransactionCategory[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Salary",
  "Other",
];

export default function AddTransactionScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    const numericAmount = Number(amount);

    if (!user) {
      Alert.alert("Not signed in", "Please sign in to save a transaction.");
      return;
    }

    if (!amount.trim() || Number.isNaN(numericAmount)) {
      Alert.alert("Invalid amount", "Please enter a valid transaction amount.");
      return;
    }

    if (numericAmount <= 0) {
      Alert.alert(
        "Invalid amount",
        "The transaction amount must be greater than ₦0.",
      );
      return;
    }

    if (!category) {
      Alert.alert(
        "Category required",
        "Please select a category for this transaction.",
      );
      return;
    }

    try {
      await addTransaction(user.uid, {
        type: transactionType,
        amount: numericAmount,
        category: category as TransactionCategory,
        description: description.trim(),
        date: new Date().toISOString(),
      });

      Alert.alert(
        "Transaction saved",
        `${transactionType === "income" ? "Income" : "Expense"} of ₦${numericAmount.toLocaleString()} has been saved successfully.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error("Failed to save transaction:", error);

      Alert.alert(
        "Save failed",
        "We could not save your transaction. Please check your connection and try again.",
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: theme.iconBackground,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={21} color={theme.primary} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Add Transaction
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Transaction Type */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Transaction type
        </Text>

        <View
          style={[
            styles.typeContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            onPress={() => setTransactionType("expense")}
            style={[
              styles.typeButton,
              transactionType === "expense" && {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={21}
              color={
                transactionType === "expense" ? theme.white : theme.expense
              }
            />

            <Text
              style={[
                styles.typeText,
                {
                  color:
                    transactionType === "expense" ? theme.white : theme.text,
                },
              ]}
            >
              Expense
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTransactionType("income")}
            style={[
              styles.typeButton,
              transactionType === "income" && {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={21}
              color={transactionType === "income" ? theme.white : theme.income}
            />

            <Text
              style={[
                styles.typeText,
                {
                  color:
                    transactionType === "income" ? theme.white : theme.text,
                },
              ]}
            >
              Income
            </Text>
          </Pressable>
        </View>

        {/* Amount */}
        <Text style={[styles.label, { color: theme.text }]}>Amount</Text>

        <View
          style={[
            styles.amountContainer,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.currency, { color: theme.secondaryText }]}>
            ₦
          </Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={theme.secondaryText}
            keyboardType="decimal-pad"
            style={[styles.amountInput, { color: theme.text }]}
          />
        </View>

        {/* Category */}
        <Text style={[styles.label, { color: theme.text }]}>Category</Text>

        <View style={styles.categories}>
          {categories.map((item) => {
            const selected = category === item;

            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selected ? theme.primary : theme.card,
                    borderColor: selected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selected ? theme.white : theme.text,
                    },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Description */}
        <Text style={[styles.label, { color: theme.text }]}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What was this transaction for?"
          placeholderTextColor={theme.secondaryText}
          multiline
          textAlignVertical="top"
          style={[
            styles.descriptionInput,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
        />

        {/* Date */}
        <Text style={[styles.label, { color: theme.text }]}>Date</Text>

        <View
          style={[
            styles.dateContainer,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />

          <Text style={[styles.dateText, { color: theme.text }]}>Today</Text>

          <Ionicons name="chevron-down" size={18} color={theme.secondaryText} />
        </View>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: theme.primary,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color={theme.white}
          />

          <Text style={[styles.saveButtonText, { color: theme.white }]}>
            Save Transaction
          </Text>
        </Pressable>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  (typeof import("@/src/theme/ThemeContext"))["useTheme"]
>["theme"];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 42,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  typeContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 5,
    marginBottom: 26,
  },

  typeButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  typeText: {
    fontSize: 14,
    fontWeight: "700",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
  },

  amountContainer: {
    height: 58,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 22,
  },

  currency: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    height: "100%",
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 22,
  },

  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },

  descriptionInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 14,
    marginBottom: 22,
  },

  dateContainer: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 28,
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },

  saveButton: {
    minHeight: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  bottomSpacing: {
    height: 20,
  },
});
