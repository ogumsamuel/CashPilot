import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { db } from './firebase';

export type GoalStatus = 'active' | 'completed';

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string | null;
  status: GoalStatus;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CreateGoalData {
  name: string;
  targetAmount: number;
  savedAmount?: number;
  targetDate?: string | null;
}

export interface UpdateGoalData {
  name?: string;
  targetAmount?: number;
  savedAmount?: number;
  targetDate?: string | null;
  status?: GoalStatus;
}

function getGoalStatus(
  savedAmount: number,
  targetAmount: number
): GoalStatus {
  return savedAmount >= targetAmount
    ? 'completed'
    : 'active';
}

export async function createGoal(
  uid: string,
  goalData: CreateGoalData
) {
  const goalsRef = collection(
    db,
    'users',
    uid,
    'goals'
  );

  const savedAmount = Math.max(
    Number(goalData.savedAmount) || 0,
    0
  );

  const targetAmount = Math.max(
    Number(goalData.targetAmount) || 0,
    0
  );

  const goalRef = await addDoc(goalsRef, {
    userId: uid,
    name: goalData.name.trim(),
    targetAmount,
    savedAmount,
    targetDate: goalData.targetDate ?? null,
    status: getGoalStatus(
      savedAmount,
      targetAmount
    ),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return goalRef.id;
}

export async function updateGoal(
  uid: string,
  goalId: string,
  updates: UpdateGoalData
) {
  const goalRef = doc(
    db,
    'users',
    uid,
    'goals',
    goalId
  );

  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.name !== undefined) {
    updateData.name = updates.name.trim();
  }

  if (updates.targetAmount !== undefined) {
    updateData.targetAmount = Math.max(
      Number(updates.targetAmount) || 0,
      0
    );
  }

  if (updates.savedAmount !== undefined) {
    updateData.savedAmount = Math.max(
      Number(updates.savedAmount) || 0,
      0
    );
  }

  if (updates.targetDate !== undefined) {
    updateData.targetDate = updates.targetDate;
  }

  if (updates.status !== undefined) {
    updateData.status = updates.status;
  } else if (
    updates.savedAmount !== undefined ||
    updates.targetAmount !== undefined
  ) {
    const currentSavedAmount =
      Number(updates.savedAmount) || 0;

    const currentTargetAmount =
      Number(updates.targetAmount) || 0;

    updateData.status = getGoalStatus(
      currentSavedAmount,
      currentTargetAmount
    );
  }

  await setDoc(goalRef, updateData, {
    merge: true,
  });
}

export async function addToGoal(
  uid: string,
  goalId: string,
  amount: number,
  currentSavedAmount: number,
  targetAmount: number
) {
  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      'Contribution amount must be greater than zero.'
    );
  }

  const newSavedAmount =
    Math.max(Number(currentSavedAmount) || 0, 0) +
    numericAmount;

  const goalRef = doc(
    db,
    'users',
    uid,
    'goals',
    goalId
  );

  await setDoc(
    goalRef,
    {
      savedAmount: newSavedAmount,
      status: getGoalStatus(
        newSavedAmount,
        Number(targetAmount) || 0
      ),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function deleteGoal(
  uid: string,
  goalId: string
) {
  const goalRef = doc(
    db,
    'users',
    uid,
    'goals',
    goalId
  );

  await deleteDoc(goalRef);
}

export function subscribeToGoals(
  uid: string,
  onGoals: (goals: Goal[]) => void,
  onError?: (error: Error) => void
) {
  const goalsRef = collection(
    db,
    'users',
    uid,
    'goals'
  );

  return onSnapshot(
    goalsRef,
    (snapshot) => {
      const goals = snapshot.docs
        .map((document) => {
          const data = document.data();

          const targetAmount =
            Number(data.targetAmount) || 0;

          const savedAmount =
            Number(data.savedAmount) || 0;

          return {
            id: document.id,
            userId: uid,
            name: String(data.name ?? ''),
            targetAmount,
            savedAmount,
            targetDate:
              data.targetDate ?? null,
            status:
              data.status === 'completed'
                ? 'completed'
                : getGoalStatus(
                    savedAmount,
                    targetAmount
                  ),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          } as Goal;
        })
        .sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === 'active' ? -1 : 1;
          }

          return a.name.localeCompare(b.name);
        });

      onGoals(goals);
    },
    (error) => {
      console.error(
        'Failed to listen to goals:',
        error
      );

      onError?.(error);
    }
  );
}