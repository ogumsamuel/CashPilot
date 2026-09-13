import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

import { TransactionCategory, TransactionType, Transaction } from "../types/transactions";

interface AddTransactionData {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
}
export async function getTransactions(uid: string) {
  const transactionsRef = collection(
    db,
    'users',
    uid,
    'transactions'
  );

  const transactionsQuery = query(
    transactionsRef,
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(transactionsQuery);

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      userId: uid,
      type: data.type,
      amount: Number(data.amount) || 0,
      category: data.category,
      description: data.description ?? '',
      date: data.date,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}

export function subscribeToTransactions(
  uid: string,
  onTransactions: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) {
  const transactionsRef = collection(
    db,
    'users',
    uid,
    'transactions'
  );

  const transactionsQuery = query(
    transactionsRef,
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(
    transactionsQuery,
    (snapshot) => {
      const transactions = snapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,
          userId: uid,
          type: data.type,
          amount: Number(data.amount) || 0,
          category: data.category,
          description: data.description ?? '',
          date: data.date,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Transaction;
      });

      onTransactions(transactions);
    },
    (error) => {
      console.error(
        'Failed to listen to transactions:',
        error
      );

      onError?.(error);
    }
  );

  return unsubscribe;
}


export async function addTransaction(
  uid: string,
  transaction: AddTransactionData,
) {
  const transactionsRef = collection(db, "users", uid, "transactions");

  const transactionRef = await addDoc(transactionsRef, {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return transactionRef.id;
}

export async function getCashBalance(uid: string) {
  const transactionsRef = collection(db, "users", uid, "transactions");

  const snapshot = await getDocs(transactionsRef);

  let totalIncome = 0;
  let totalExpenses = 0;

  snapshot.forEach((document) => {
    const data = document.data();

    const amount = Number(data.amount) || 0;

    if (data.type === "income") {
      totalIncome += amount;
    }

    if (data.type === "expense") {
      totalExpenses += amount;
    }
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}
