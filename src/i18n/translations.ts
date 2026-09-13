export type LanguageCode = 'en' | 'ig' | 'yo' | 'ha';

export interface TranslationKeys {
  // Navigation
  home: string;
  activity: string;
  budgets: string;
  goals: string;
  more: string;

  // Common
  back: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  close: string;
  confirm: string;
  yes: string;
  no: string;
  loading: string;

  // Settings
  settings: string;
  appearance: string;
  language: string;
  chooseLanguage: string;
  chooseLanguageDescription: string;
  languageSavedOnDevice: string;

  // More
  profile: string;
  security: string;
  notifications: string;
  helpSupport: string;
  aboutCashPilot: string;
  account: string;
  support: string;

  // Home
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  balance: string;
  income: string;
  expenses: string;
  quickActions: string;
  addIncome: string;
  addExpense: string;
  transfer: string;
  newGoal: string;
  cashFlow: string;
  spendingOverview: string;
  recentTransactions: string;
  viewAll: string;
  noTransactions: string;

  // Activity
  transactions: string;
  all: string;
  noTransactionsYet: string;

  // Budgets
  budget: string;
  totalBudget: string;
  totalSpent: string;
  remaining: string;
  noBudgets: string;

  // Goals
  savingsGoals: string;
  activeGoals: string;
  completedGoals: string;
  createGoal: string;
  target: string;
  saved: string;
  addContribution: string;

  // Profile
  editProfile: string;
  name: string;
  email: string;
  accountInformation: string;
  signOut: string;

  // Security
  changePassword: string;
  resetPassword: string;
  authentication: string;
  emailAndPassword: string;

  // Notifications
  notificationPreferences: string;
  enableAll: string;
  disableAll: string;

  // Support
  contactSupport: string;
  frequentlyAskedQuestions: string;

  // About
  termsOfService: string;
  privacyPolicy: string;
  website: string;
}

const english: TranslationKeys = {
  home: 'Home',
  activity: 'Activity',
  budgets: 'Budgets',
  goals: 'Goals',
  more: 'More',

  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  close: 'Close',
  confirm: 'Confirm',
  yes: 'Yes',
  no: 'No',
  loading: 'Loading...',

  settings: 'Settings',
  appearance: 'Appearance',
  language: 'Language',
  chooseLanguage: 'Choose your language',
  chooseLanguageDescription:
    'Select the language you want to use throughout CashPilot.',
  languageSavedOnDevice:
    'Your language preference is saved on this device.',

  profile: 'Profile',
  security: 'Security',
  notifications: 'Notifications',
  helpSupport: 'Help & Support',
  aboutCashPilot: 'About CashPilot',
  account: 'Account',
  support: 'Support',

  goodMorning: 'Good morning',
  goodAfternoon: 'Good afternoon',
  goodEvening: 'Good evening',
  balance: 'Balance',
  income: 'Income',
  expenses: 'Expenses',
  quickActions: 'Quick Actions',
  addIncome: 'Add Income',
  addExpense: 'Add Expense',
  transfer: 'Transfer',
  newGoal: 'New Goal',
  cashFlow: 'Cash Flow',
  spendingOverview: 'Spending Overview',
  recentTransactions: 'Recent Transactions',
  viewAll: 'View All',
  noTransactions: 'No transactions yet.',

  transactions: 'Transactions',
  all: 'All',
  noTransactionsYet: 'No transactions yet.',

  budget: 'Budget',
  totalBudget: 'Total Budget',
  totalSpent: 'Total Spent',
  remaining: 'Remaining',
  noBudgets: 'No budgets yet.',

  savingsGoals: 'Savings Goals',
  activeGoals: 'Active Goals',
  completedGoals: 'Completed Goals',
  createGoal: 'Create Goal',
  target: 'Target',
  saved: 'Saved',
  addContribution: 'Add Contribution',

  editProfile: 'Edit Profile',
  name: 'Name',
  email: 'Email',
  accountInformation: 'Account Information',
  signOut: 'Sign Out',

  changePassword: 'Change Password',
  resetPassword: 'Reset Password',
  authentication: 'Authentication',
  emailAndPassword: 'Email & Password',

  notificationPreferences: 'Notification Preferences',
  enableAll: 'Enable All',
  disableAll: 'Disable All',

  contactSupport: 'Contact Support',
  frequentlyAskedQuestions: 'Frequently Asked Questions',

  termsOfService: 'Terms of Service',
  privacyPolicy: 'Privacy Policy',
  website: 'CashPilot Website',
};

const igbo: TranslationKeys = {
  home: 'Ụlọ',
  activity: 'Ọrụ',
  budgets: 'Atụmatụ mmefu',
  goals: 'Ebumnuche',
  more: 'Ọzọ',

  back: 'Laghachi',
  save: 'Chekwaa',
  cancel: 'Kagbuo',
  delete: 'Hichapụ',
  edit: 'Dezie',
  close: 'Mechie',
  confirm: 'Kwenye',
  yes: 'Ee',
  no: 'Mba',
  loading: 'Na-ebudata...',

  settings: 'Ntọala',
  appearance: 'Ọdịdị',
  language: 'Asụsụ',
  chooseLanguage: 'Họrọ asụsụ gị',
  chooseLanguageDescription:
    'Họrọ asụsụ ịchọrọ iji na CashPilot.',
  languageSavedOnDevice:
    'A chekwara nhọrọ asụsụ gị na ngwaọrụ a.',

  profile: 'Profaịlụ',
  security: 'Nchekwa',
  notifications: 'Ọkwa ozi',
  helpSupport: 'Enyemaka na Nkwado',
  aboutCashPilot: 'Banyere CashPilot',
  account: 'Akaụntụ',
  support: 'Nkwado',

  goodMorning: 'Ụtụtụ ọma',
  goodAfternoon: 'Ehihie ọma',
  goodEvening: 'Mgbede ọma',
  balance: 'Ego fọdụrụ',
  income: 'Ego batara',
  expenses: 'Mmefu',
  quickActions: 'Omume ngwa ngwa',
  addIncome: 'Tinye ego batara',
  addExpense: 'Tinye mmefu',
  transfer: 'Nyefee ego',
  newGoal: 'Ebumnuche ọhụrụ',
  cashFlow: 'Ntugharị ego',
  spendingOverview: 'Nchịkọta mmefu',
  recentTransactions: 'Azụmahịa ọhụrụ',
  viewAll: 'Lee ha niile',
  noTransactions: 'Enweghị azụmahịa ugbu a.',

  transactions: 'Azụmahịa',
  all: 'Ha niile',
  noTransactionsYet: 'Enweghị azụmahịa ugbu a.',

  budget: 'Atụmatụ mmefu',
  totalBudget: 'Atụmatụ mmefu niile',
  totalSpent: 'Ego niile e mefuru',
  remaining: 'Ego fọdụrụ',
  noBudgets: 'Enweghị atụmatụ mmefu.',

  savingsGoals: 'Ebumnuche nchekwa ego',
  activeGoals: 'Ebumnuche na-aga n’ihu',
  completedGoals: 'Ebumnuche emechara',
  createGoal: 'Mepụta ebumnuche',
  target: 'Ebumnuche ego',
  saved: 'Ego echekwara',
  addContribution: 'Tinye ego',

  editProfile: 'Dezie profaịlụ',
  name: 'Aha',
  email: 'Email',
  accountInformation: 'Ozi akaụntụ',
  signOut: 'Pụọ',

  changePassword: 'Gbanwee okwuntughe',
  resetPassword: 'Tọgharịa okwuntughe',
  authentication: 'Nyocha njirimara',
  emailAndPassword: 'Email na okwuntughe',

  notificationPreferences: 'Nhọrọ ọkwa ozi',
  enableAll: 'Gbanye ha niile',
  disableAll: 'Mechie ha niile',

  contactSupport: 'Kpọtụrụ nkwado',
  frequentlyAskedQuestions: 'Ajụjụ ndị a na-ajụkarị',

  termsOfService: 'Usoro ọrụ',
  privacyPolicy: 'Iwu nzuzo',
  website: 'Weebụsaịtị CashPilot',
};

const yoruba: TranslationKeys = {
  home: 'Ile',
  activity: 'Iṣẹ́',
  budgets: 'Àwọn isuna',
  goals: 'Àwọn ibi-afẹ́de',
  more: 'Síi',

  back: 'Padà',
  save: 'Fipamọ́',
  cancel: 'Fagilé',
  delete: 'Paarẹ',
  edit: 'Ṣàtúnṣe',
  close: 'Pade',
  confirm: 'Jẹ́rìí',
  yes: 'Bẹ́ẹ̀ni',
  no: 'Rárá',
  loading: 'Ń gbé jáde...',

  settings: 'Àwọn ètò',
  appearance: 'Ìrísí',
  language: 'Èdè',
  chooseLanguage: 'Yan èdè rẹ',
  chooseLanguageDescription:
    'Yan èdè tí o fẹ́ lò nínú CashPilot.',
  languageSavedOnDevice:
    'A ti fipamọ́ yíyan èdè rẹ sínú ẹ̀rọ yìí.',

  profile: 'Àkọọ́lẹ̀ ẹni',
  security: 'Ààbò',
  notifications: 'Àwọn ìfitónilétí',
  helpSupport: 'Ìrànlọ́wọ́ àti Àtìlẹ́yìn',
  aboutCashPilot: 'Nípa CashPilot',
  account: 'Àkọọ́lẹ̀',
  support: 'Àtìlẹ́yìn',

  goodMorning: 'Ẹ káàárọ̀',
  goodAfternoon: 'Ẹ káàsán',
  goodEvening: 'Ẹ káalẹ́',
  balance: 'Iwọ̀ntúnwonsì',
  income: 'Owó tí wọlé',
  expenses: 'Àwọn ìnáwó',
  quickActions: 'Àwọn iṣẹ́ kíákíá',
  addIncome: 'Fi owó wọlé',
  addExpense: 'Fi ìnáwó kún',
  transfer: 'Rán owó',
  newGoal: 'Ibi-afẹ́de tuntun',
  cashFlow: 'Ìṣàn owó',
  spendingOverview: 'Àkópọ̀ ìnáwó',
  recentTransactions: 'Àwọn ìṣòwò tuntun',
  viewAll: 'Wo gbogbo rẹ̀',
  noTransactions: 'Kò sí ìṣòwò kankan.',

  transactions: 'Àwọn ìṣòwò',
  all: 'Gbogbo rẹ̀',
  noTransactionsYet: 'Kò sí ìṣòwò kankan.',

  budget: 'Isuna',
  totalBudget: 'Àpapọ̀ isuna',
  totalSpent: 'Àpapọ̀ tí a ná',
  remaining: 'Tí ó kù',
  noBudgets: 'Kò sí isuna kankan.',

  savingsGoals: 'Àwọn ibi-afẹ́de ìfipamọ́',
  activeGoals: 'Àwọn ibi-afẹ́de tó ń lọ',
  completedGoals: 'Àwọn ibi-afẹ́de tí a parí',
  createGoal: 'Ṣẹ̀dá ibi-afẹ́de',
  target: 'Àfojúsùn',
  saved: 'Tí a ti fipamọ́',
  addContribution: 'Fi owó kún',

  editProfile: 'Ṣàtúnṣe àkọọ́lẹ̀ ẹni',
  name: 'Orúkọ',
  email: 'Email',
  accountInformation: 'Alaye àkọọ́lẹ̀',
  signOut: 'Jáde',

  changePassword: 'Yí ọ̀rọ̀ aṣínà padà',
  resetPassword: 'Tún ọ̀rọ̀ aṣínà ṣe',
  authentication: 'Ìmúdájú',
  emailAndPassword: 'Email àti ọ̀rọ̀ aṣínà',

  notificationPreferences: 'Àwọn àṣàyàn ìfitónilétí',
  enableAll: 'Mú gbogbo rẹ̀ ṣiṣẹ́',
  disableAll: 'Pa gbogbo rẹ̀',

  contactSupport: 'Kàn sí àtìlẹ́yìn',
  frequentlyAskedQuestions: 'Àwọn ìbéèrè tí a máa ń béèrè',

  termsOfService: 'Àwọn òfin iṣẹ́',
  privacyPolicy: 'Ìlànà àṣírí',
  website: 'Wẹ́ẹ̀bù CashPilot',
};

const hausa: TranslationKeys = {
  home: 'Gida',
  activity: 'Ayyuka',
  budgets: 'Kasafi',
  goals: 'Manufofi',
  more: 'Ƙari',

  back: 'Koma',
  save: 'Ajiye',
  cancel: 'Soke',
  delete: 'Share',
  edit: 'Gyara',
  close: 'Rufe',
  confirm: 'Tabbatar',
  yes: 'Eh',
  no: 'A’a',
  loading: 'Ana lodawa...',

  settings: 'Saituna',
  appearance: 'Bayyanar',
  language: 'Harshe',
  chooseLanguage: 'Zaɓi harshenka',
  chooseLanguageDescription:
    'Zaɓi harshen da kake son amfani da shi a CashPilot.',
  languageSavedOnDevice:
    'An ajiye zaɓin harshenka a wannan na’urar.',

  profile: 'Bayanan mutum',
  security: 'Tsaro',
  notifications: 'Sanarwa',
  helpSupport: 'Taimako da Tallafi',
  aboutCashPilot: 'Game da CashPilot',
  account: 'Asusu',
  support: 'Tallafi',

  goodMorning: 'Barka da safiya',
  goodAfternoon: 'Barka da rana',
  goodEvening: 'Barka da yamma',
  balance: 'Ma’aunin kuɗi',
  income: 'Kuɗin shiga',
  expenses: 'Kuɗin fita',
  quickActions: 'Ayyuka masu sauri',
  addIncome: 'Ƙara kuɗin shiga',
  addExpense: 'Ƙara kuɗin fita',
  transfer: 'Tura kuɗi',
  newGoal: 'Sabon buri',
  cashFlow: 'Gudanar kuɗi',
  spendingOverview: 'Bayanin kashe kuɗi',
  recentTransactions: 'Ma’amaloli na baya-bayan nan',
  viewAll: 'Duba duka',
  noTransactions: 'Babu ma’amala tukuna.',

  transactions: 'Ma’amaloli',
  all: 'Duka',
  noTransactionsYet: 'Babu ma’amala tukuna.',

  budget: 'Kasafi',
  totalBudget: 'Jimillar kasafi',
  totalSpent: 'Jimillar da aka kashe',
  remaining: 'Abin da ya rage',
  noBudgets: 'Babu kasafi tukuna.',

  savingsGoals: 'Manufofin ajiya',
  activeGoals: 'Manufofi masu aiki',
  completedGoals: 'Manufofin da aka kammala',
  createGoal: 'Ƙirƙiri buri',
  target: 'Manufa',
  saved: 'Abin da aka ajiye',
  addContribution: 'Ƙara kuɗi',

  editProfile: 'Gyara bayanan mutum',
  name: 'Suna',
  email: 'Email',
  accountInformation: 'Bayanan asusu',
  signOut: 'Fita',

  changePassword: 'Canja kalmar sirri',
  resetPassword: 'Sake saita kalmar sirri',
  authentication: 'Tabbatarwa',
  emailAndPassword: 'Email da kalmar sirri',

  notificationPreferences: 'Zaɓuɓɓukan sanarwa',
  enableAll: 'Kunna duka',
  disableAll: 'Kashe duka',

  contactSupport: 'Tuntuɓi tallafi',
  frequentlyAskedQuestions: 'Tambayoyin da ake yawan yi',

  termsOfService: 'Sharuɗɗan sabis',
  privacyPolicy: 'Manufar sirri',
  website: 'Gidan yanar gizon CashPilot',
};

export const translations: Record<
  LanguageCode,
  TranslationKeys
> = {
  en: english,
  ig: igbo,
  yo: yoruba,
  ha: hausa,
};