CashPilot 💰

CashPilot is a modern personal finance management mobile application built with React Native and Expo. It helps users track income and expenses, manage budgets, set savings goals, monitor financial activity, and personalize their experience through themes, notifications, and language preferences.

The project is designed with a scalable architecture that can support secure authentication, cloud data storage, financial insights, and additional financial services as development continues.

📱 Features

🔐 Authentication

* User registration and sign-in
* Firebase Authentication
* Protected application routes
* Persistent authentication state
* Secure password change and password reset flow

💰 Transaction Management

* Add income and expenses
* Categorize transactions
* Transaction descriptions and dates
* Real-time transaction updates
* Automatic income, expense, and balance calculations
* Recent transaction history
* Dedicated activity screen

📊 Financial Overview

* Current balance
* Total income
* Total expenses
* Cash-flow overview
* Six-month spending overview
* Recent transaction preview

📋 Budget Management

* Create monthly budgets
* Set category spending limits
* Track spending against budgets
* Calculate remaining budget
* Monitor category progress
* Monthly spending calculations based on transaction history

🎯 Savings Goals

* Create financial goals
* Set target amounts
* Set target dates
* Add contributions
* Track progress
* Edit and delete goals
* Automatic completion tracking

🎨 Personalization

* Light mode
* Dark mode
* System theme
* Persistent theme preference
* Language selection
* English
* Igbo
* Yorùbá
* Hausa

⚙️ Account & Settings

* Profile management
* Account information
* Security settings
* Password management
* Notification preferences
* Appearance settings
* Language settings
* Help & Support
* About CashPilot

🔔 Notifications

Users can manage preferences for:

* Transaction updates
* Budget alerts
* Goal updates
* Weekly summaries
* Financial tips
* Announcements

📄 Legal & Privacy

CashPilot includes dedicated areas for:

* Terms of Service
* Privacy Policy
* Account controls
* Privacy management
* Account deactivation and deletion planning

Legal and privacy documents are currently project drafts and should be reviewed for applicable laws and regulations before commercial release.

⸻

🛠️ Tech Stack

Frontend

* React Native
* Expo
* TypeScript
* Expo Router

Backend & Data

* Firebase Authentication
* Cloud Firestore
* Firebase real-time data subscriptions

Storage & Persistence

* AsyncStorage
* Local preference persistence

Development Tools

* Git
* GitHub
* VS Code
* Expo Go

⸻

🏗️ Project Architecture

CashPilot uses a feature-oriented structure that separates screens, application state, services, themes, translations, and data models.

cashpilot/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── activity.tsx
│   │   ├── budgets.tsx
│   │   ├── goals.tsx
│   │   └── more.tsx
│   │
│   ├── signin.tsx
│   ├── signup.tsx
│   ├── add-transaction.tsx
│   ├── profile.tsx
│   ├── settings.tsx
│   ├── appearance.tsx
│   ├── language.tsx
│   ├── security.tsx
│   ├── notifications.tsx
│   ├── help-support.tsx
│   ├── about.tsx
│   ├── terms.tsx
│   ├── privacy-policy.tsx
│   └── _layout.tsx
│
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── i18n/
│   │   ├── LanguageContext.tsx
│   │   └── translations.ts
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── transactions.ts
│   │   ├── budgets.ts
│   │   ├── goals.ts
│   │   └── userProfile.ts
│   │
│   ├── theme/
│   │   └── ThemeContext.tsx
│   │
│   └── types/
│       └── transactions.ts
│
├── components/
├── constants/
├── hooks/
├── assets/
├── app.json
├── package.json
└── tsconfig.json

⸻

🔥 Firebase Architecture

CashPilot uses Firebase for authentication and cloud data storage.

User-specific data is organized under the authenticated user’s UID:

users/
└── {uid}/
    ├── transactions/
    ├── budgets/
    └── goals/

User profile information is stored under:

users/
└── {uid}

This structure keeps financial records associated with the authenticated account and provides a foundation for scalable security rules.

⸻

🔄 Real-Time Data

CashPilot uses Firestore real-time listeners for important financial data.

For example, when a transaction is added or updated, the application can automatically refresh:

* Current balance
* Income
* Expenses
* Cash flow
* Recent transactions
* Spending overview
* Budget calculations

This reduces the need for manually refreshing screens and provides a more responsive user experience.

⸻

🎨 Theme System

CashPilot uses a centralized theme system rather than defining colors independently on every screen.

Supported modes:

System
Light
Dark

The selected preference is persisted locally so the user’s appearance choice remains after restarting the application.

⸻

🌍 Internationalization

CashPilot includes a custom language system designed to make the interface adaptable to multiple languages.

Currently supported:

English
Igbo
Yorùbá
Hausa

Translations are managed centrally through the application’s language context and translation dictionaries.

⸻

🔐 Security Approach

Security is an important part of CashPilot’s architecture.

Current implementation includes:

* Firebase Authentication
* Protected application routes
* Password re-authentication before password changes
* Password reset functionality
* User-specific Firestore data paths
* Separation of authentication and application data

Future production work will include stronger Firestore security rules, secure data handling, audit logging, account restriction/deactivation workflows, and additional protections appropriate for a financial application.

CashPilot is currently a development/portfolio project and should not be considered a production financial service.

⸻

🚀 Getting Started

Prerequisites

Make sure you have installed:

* Node.js
* npm
* Expo CLI / Expo tooling
* Expo Go on a compatible mobile device
* A Firebase project

Clone the repository

git clone https://github.com/ogumsamuel/CashPilot.git

Enter the project

cd CashPilot

Install dependencies

npm install

Start the development server

npx expo start

You can then open the application using Expo Go or an available emulator/simulator.

⸻

🔧 Environment & Firebase Configuration

CashPilot uses Firebase Authentication and Cloud Firestore.

Before running the application with your own Firebase project, configure the Firebase project and update the Firebase configuration used by the application.

For production deployments, sensitive configuration and credentials should be managed using appropriate environment and deployment configuration rather than committed to source control.

⸻

🧪 Development

TypeScript can be checked with:

npx tsc --noEmit

The project is developed incrementally with a focus on:

* Type safety
* Reusable components
* Centralized state/context
* Scalable service architecture
* Responsive mobile UI
* Maintainable code organization

⸻

🗺️ Roadmap

Planned improvements include:

* [ ]	Stronger Firestore security rules
* [ ]	Production-ready notification infrastructure
* [ ]	Advanced financial analytics
* [ ]	More detailed spending charts
* [ ]	Recurring transactions
* [ ]	Recurring budgets
* [ ]	Improved financial insights
* [ ]	Secure account deactivation and data-management workflows
* [ ]	Audit logging
* [ ]	Enhanced testing
* [ ]	EAS production builds
* [ ]	App Store / Google Play deployment
* [ ]	Additional financial features

⸻

📸 Screenshots


![Signup&Signin screen](https://github.com/ogumsamuel/CashPilot/blob/7907ec9aeb0d4d510429110621ae23b07cb37d29/Signin%26Signup.jpeg)

![Home Screen](https://github.com/ogumsamuel/CashPilot/blob/4caff655358688853afb2d30cd6d47b3320aeef0/CashpilotHome.jpeg)

![Activity screen](https://github.com/ogumsamuel/CashPilot/blob/29eb9a5562ea22a8e952691581c3aecb51bfaaf0/Activity.jpeg)

![Budgets screen](https://github.com/ogumsamuel/CashPilot/blob/2788080658d11654000caa1074694b5bf5373d81/Budgets.jpeg)

⸻

👨‍💻 Developer

Ogum Samuel

Software Developer focused on building modern mobile and web applications with React, React Native, TypeScript, Firebase, and other modern development technologies.

Connect

* GitHub: https://github.com/ogumsamuel
* CashPilot Repository: https://github.com/ogumsamuel/CashPilot
* LinkedIn: https://linkedin.com/in/ogumsamuel

⸻

📄 License

This project is currently intended as a portfolio and development project.

A formal open-source license can be added if the project is later released for public use or contribution.
