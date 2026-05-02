# Kitchen Profit Professional 🍳

**Managing margins for food business.**

Kitchen Profit Professional is an intelligent food cost control and margin analysis platform built on a serverless, global-scale architecture.

## 🚀 How to Export & Launch

### 1. Download Your Code
- **Locate the Download Icon**: In the top right corner of the Firebase Studio toolbar, click the **Download** icon (downward arrow). 
- **Extract**: Save the ZIP file to your computer and extract it to a folder.

### 2. Local Setup
- **Install Dependencies**: Open your terminal, navigate to the project folder, and run:
  ```bash
  npm install
  ```
- **Secret Keys**: Rename `.env.example` to `.env.local` and add your `GEMINI_API_KEY`.

### 3. Firebase Production Setup
- **Console**: Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
- **Services**: Enable **Firestore** (Production Mode) and **Authentication** (Email/Password & Anonymous).
- **Config**: Update `src/firebase/config.ts` with the keys from your new Firebase Project settings.

### 4. Deploy to the Web
- **GitHub**: Push your code to a private or public GitHub repository.
- **App Hosting**: In the Firebase Console, connect the repository to **Firebase App Hosting**. It will automatically handle the build and deployment.

### 5. Security (App Check)
- Register for **reCAPTCHA Enterprise** in the Google Cloud Console.
- Add your Site Key to the Firebase App Check settings.
- **Important**: Only enable enforcement after your production domain is live to avoid blocking yourself during testing.

## 🖼️ Branding & Identity
- **Subtle Puzzle Logo**: Features a 2x2 quadrant design with elegant, low-contrast white separation lines.
- **Frosted Glass**: All branding elements utilize a premium `backdrop-blur-md` effect.
- **Customization**: Update the platform logo in the **Settings** (supports high-res assets up to 10MB).

## 🔐 Support & Administration
- **Default Admin**: `chefdtanju@gmail.com` has root access to the Diagnostic Console and Marketing AI Lab.
- **Security**: Data is isolated per user via Firestore Security Rules, with public access granted to global system branding.

## Built With
- **Next.js 15** (App Router)
- **Tailwind CSS & ShadCN UI**
- **Genkit** (AI Analysis & Veo Video Generation)
- **Firebase** (Firestore & Authentication)
