import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { db } from './firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function createUserProfile(
  uid: string,
  name: string,
  email: string
) {
  const userRef = doc(db, 'users', uid);

  await setDoc(userRef, {
    uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(
  uid: string
) {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  name: string
) {
  const userRef = doc(db, 'users', uid);

  await setDoc(
    userRef,
    {
      name: name.trim(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}