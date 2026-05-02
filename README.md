
# Kitchen Profit Professional 🍳

**Managing margins for food business.**

Kitchen Profit Professional is an intelligent food cost control and margin analysis platform designed for the volatile restaurant markets of Lagos and beyond.

## 🚀 Global Launch Checklist

### 1. Download & Local Setup
1. Click the **Download** icon in the top-right of Firebase Studio.
2. Unzip and run `npm install`.
3. Create a `.env.local` file for your local environment variables.

### 2. Production Firebase Setup
1. Create a new project at [console.firebase.google.com](https://console.firebase.google.com/).
2. **Firestore**: Enable in Production Mode.
3. **Authentication**: Enable Email/Password and Anonymous providers.
4. **Config**: Update `src/firebase/config.ts` with your new project credentials.

### 3. AI Intelligence (Genkit)
- Obtain a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
- Set `GEMINI_API_KEY` in your production environment variables (e.g., in Firebase App Hosting or Vercel).

### 4. Deployment
- **Firebase App Hosting**: Recommended for Next.js 15. Connect your GitHub repository for automated global delivery.
- **Body Size Limit**: The app is pre-configured for a **10MB** limit to support high-quality marketing video generation.

## 🖼️ Branding & Identity
- **Puzzle Logo**: The app uses a unique 2x2 grid aesthetic. Upload your logo in **Settings**, and it will automatically be rendered with subtle white quadrant lines.
- **Faded Effect**: Logos are sit under a high-end frosted glass layer for a premium, professional feel.

## 🔐 Support & Administration
- **Default Admin**: `chefdtanju@gmail.com` has global root access to the Diagnostic Console and Marketing AI Lab.
- **Security**: Data is isolated per user via Firestore Security Rules located in `firestore.rules`.

## Built With
- **Next.js 15** (App Router)
- **Tailwind CSS & ShadCN UI**
- **Genkit** (AI Analysis & Veo Video Generation)
- **Firebase** (Firestore & Authentication)
- **Paystack** (Regional Payment Processing)
