# Kitchen Profit Professional 🍳

**Managing margins for food business.**

Kitchen Profit Professional is an intelligent food cost control and margin analysis platform built on a serverless, global-scale architecture.

## 🚀 Deployment & Architecture

### 1. Serverless Power (No Standby Server Needed)
This app is built on a **Serverless Architecture**. You do **not** need to maintain a standby server or backend hardware.
- **Frontend & Logic**: Hosted on Firebase App Hosting (recommended) or Vercel.
- **Database**: Firestore handles scaling automatically—it costs nothing when idle and scales with your business.
- **AI**: Genkit flows run on-demand via Server Actions.

### 2. Launch Checklist
1. **Download & Install**: Click the **Download** icon in the toolbar. Once on your machine, run `npm install` in your terminal.
2. **Secret Keys**: Rename `.env.example` to `.env.local` and add your `GEMINI_API_KEY`.
3. **Firebase Production Setup**:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
   - Enable **Firestore** and **Authentication** (Email/Password & Anonymous).
   - Update `src/firebase/config.ts` with your production keys.
4. **Deploy**:
   - Push your code to a GitHub repository.
   - Connect the repository to **Firebase App Hosting** in the Firebase Console.
5. **Security & App Check (reCAPTCHA)**:
   - To protect your app, enable **App Check** in the Firebase Console.
   - Register for **reCAPTCHA Enterprise** to get your Site Key.
   - **Important**: Only enable enforcement after your production domain is live.

## 🖼️ Branding & Identity
- **Puzzle Logo**: Features a 2x2 quadrant design with subtle white separation lines for an elegant, high-tech look.
- **Frosted Glass**: All branding elements utilize a premium `backdrop-blur-md` effect.
- **Customization**: Update the platform logo in the **Settings** (supports high-res assets up to 10MB).

## 🔐 Support & Administration
- **Default Admin**: `chefdtanju@gmail.com` has root access to the Diagnostic Console and Marketing AI Lab.
- **Security**: Data is isolated per user via Firestore Security Rules, with public access granted only to global system branding.

## Built With
- **Next.js 15** (App Router)
- **Tailwind CSS & ShadCN UI**
- **Genkit** (AI Analysis & Veo Video Generation)
- **Firebase** (Firestore & Authentication)
