# Sovereign Banking Application

A modern, full-stack banking platform designed for ultra-high-net-worth individuals, featuring real-time transactions, comprehensive compliance auditing, and highly secure multi-signature capabilities.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, TypeScript, Firebase Admin
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth

## Features
- Global Currency Liquidity Management
- Real-time Transaction Processing & Clearing
- KYC/AML Compliance Workflows
- Multi-Signature Vaults & Joint Accounts
- Live Chat & Secure Messaging (Resend/Twilio Integrations)

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the example environment file and fill in the necessary keys:
   ```bash
   cp .env.example .env
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app will start with both the Express backend and Vite frontend running concurrently.

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Licensing
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
