export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Salary'
  | 'Other';

export interface Transaction {
  id: string;
  userId: string;

  type: TransactionType;

  amount: number;

  category: TransactionCategory;

  description: string;

  date: string;

  createdAt: string;

  updatedAt: string;
}
