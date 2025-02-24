ECOBAZAR 🛒🌿
A modern grocery shopping experience built with React, TypeScript, and Firebase.

Overview
ECOBAZAR is a feature-rich e-commerce platform designed for a seamless grocery shopping experience. It includes real-time data updates, secure payments, and efficient state management for a smooth user experience.

Tech Stack
Frontend: React, TypeScript, Vite
State Management: Redux Toolkit
Backend & Database: Firebase (Authentication, Firestore, Hosting)
Styling: Tailwind CSS
Build Tool: Vite
Features
✅ Intuitive UI: A modern and responsive design for smooth navigation.
✅ Shopping Cart & Wishlist: Easily add, remove, and manage products.
✅ Secure Authentication: Firebase authentication with email/password and Google login.
✅ Real-time Updates: Live data synchronization for inventory and order tracking.
✅ Optimized Performance: Fast page loads with efficient state management using Redux Toolkit.
✅ Secure Payments: Integrated payment gateway for a safe checkout process.

Getting Started
Installation
Clone the repository:
sh
Copy
Edit
git clone https://github.com/yourusername/ecobazar.git
cd ecobazar
Install dependencies:
sh
Copy
Edit
npm install
Start the development server:
sh
Copy
Edit
npm run dev
Open http://localhost:5173 in your browser.
ESLint & Code Quality
ECOBAZAR follows strict ESLint rules for maintainability. If you're working on the project, ensure ESLint is properly configured:

Expanding ESLint Configuration
If you're developing a production application, update your ESLint config for type-aware linting:

js
Copy
Edit
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
Use tseslint.configs.recommendedTypeChecked or tseslint.configs.strictTypeChecked for better type safety.
Install eslint-plugin-react and update your ESLint config:
js
Copy
Edit
import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
Deployment
To deploy ECOBAZAR using Firebase Hosting:

Build the project:
sh
Copy
Edit
npm run build
Deploy to Firebase:
sh
Copy
Edit
firebase deploy
Contributing
Contributions are welcome! Feel free to submit issues or pull requests to improve the platform.
