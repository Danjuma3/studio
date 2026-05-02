
# Kitchen Profit Professional 🍳

**Managing margins for food business.**

Kitchen Profit Professional is an intelligent food cost control and margin analysis platform designed for the volatile restaurant markets of Lagos and beyond.

## 🚀 Deployment & Architecture

### 1. Serverless Power (No Standby Server Needed)
This app is built on a **Serverless Architecture**. You do **not** need to maintain a standby server or backend hardware.
- **Frontend & Logic**: Hosted on Firebase App Hosting (recommended) or Vercel.
- **Database**: Firestore handles scaling automatically—it "wakes up" when called and costs nothing when idle.
- **AI**: Genkit flows run on-demand via Server Actions.

### 2. Launch Checklist
1. **Firebase Production Setup**:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
   - Enable **Firestore** and **Authentication** (Email/Password & Anonymous).
   - Update `src/firebase/config.ts` with your production keys.
2. **Environment Variables**:
   - Set `GEMINI_API_KEY` in your hosting provider's dashboard (e.g., Firebase App Hosting or Vercel).
3. **Security & App Check (reCAPTCHA)**:
   - To protect your app from bots, enable **App Check** in the Firebase Console.
   - You will need a **reCAPTCHA Enterprise Site Key**. 
   - Get this by going to **Firebase Console > App Check > Register > reCAPTCHA Enterprise**.
   - **Crucial**: Only enable "Enforcement" after you have registered your production domain.
4. **Domain**:
   - Connect your domain (e.g., `.ng` or `.com`) via your hosting provider's DNS settings.

### 3. Local Setup
1. Click the **Download** icon in Firebase Studio.
2. Run `npm install`.
3. Create a `.env.local` file for your `GEMINI_API_KEY`.
4. Run `npm run dev` to start locally.

## 🖼️ Branding & Identity
- **Puzzle Logo**: Features a 2x2 quadrant design with subtle, low-contrast white lines for an elegant partitioned look. 
- **Faded Effect**: Logos sit under a premium frosted glass layer (`backdrop-blur-md`).
- **Customization**: Update the logo in **Settings** (supports high-res assets up to 10MB).

## 🔐 Support & Administration
- **Default Admin**: `chefdtanju@gmail.com` has root access to the Diagnostic Console and Marketing AI Lab.
- **Security**: Data is isolated per user via Firestore Security Rules.

## Built With
- **Next.js 15** (App Router)
- **Tailwind CSS & ShadCN UI**
- **Genkit** (AI Analysis & Veo Video Generation)
- **Firebase** (Firestore & Authentication)
- **Paystack** (Regional Payment Processing)
