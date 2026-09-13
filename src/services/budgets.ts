import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { db } from './firebase';

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function saveBudget(
  uid: string,
  category: string,
  monthlyLimit: number
) {
  const budgetRef = doc(
    db,
    'users',
    uid,
    'budgets',
    category
  );

  await setDoc(
    budgetRef,
    {
      userId: uid,
      category,
      monthlyLimit,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export function subscribeToBudgets(
  uid: string,
  onBudgets: (budgets: Budget[]) => void,
  onError?: (error: Error) => void
) {
  const budgetsRef = collection(
    db,
    'users',
    uid,
    'budgets'
  );

  return onSnapshot(
    budgetsRef,
    (snapshot) => {
      const budgets = snapshot.docs.map(
        (document) => {
          const data = document.data();

          return {
            id: document.id,
            userId: uid,
            category: data.category,
            monthlyLimit:
              Number(data.monthlyLimit) || 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          } as Budget;
        }
      );

      onBudgets(budgets);
    },
    (error) => {
      console.error(
        'Failed to listen to budgets:',
        error
      );

      onError?.(error);
    }
  );
}