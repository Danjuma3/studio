# Kitchen Prof 🍳

Kitchen Prof is an intelligent food cost control and margin analysis platform designed specifically for the volatile restaurant market in Lagos, Nigeria.

## 🚀 Future-Proofing & Portability
This app is built on a standard modern stack. If you ever need to move away from Firebase Studio, your code is fully portable.

### Running Locally
1. **Download** the source code.
2. **Install Dependencies**: Run `npm install`.
3. **Environment Variables**: Create a `.env.local` file with your Firebase config (found in `src/firebase/config.ts`).
4. **Start Development**: Run `npm run dev`.
5. **Genkit UI**: Run `npm run genkit:dev` for AI testing.

## 🖼️ Branding (How to Swap the Logo)
To change the app's logo and icon across all screens:
1. Upload your new image to the `public/` folder.
2. Open `src/app/lib/placeholder-images.json`.
3. Update the `imageUrl` for the `app-logo` entry to point to your new file (e.g., `"/my-new-logo.png"`).
4. The Sidebar, Header, and PWA manifest will update automatically.

## 🛠️ Core Interfaces
1. **Stock Taking**: Real-time pantry monitoring with low-stock alerts.
2. **Cost Percentage (Pro)**: Instant food cost % analysis to protect margins.
3. **Auto Profit Calculator (Pro)**: AI-driven performance audits and procurement strategies.

## 🔐 Security & Administration
- **Admin**: `chefdtanju@gmail.com` has global administrative access.
- **Payments**: Integrated with Paystack for automated Pro tier activation.
- **Rules**: Data is isolated per user using Firestore Security Rules.

## Built With
- **Next.js 15** (App Router)
- **Tailwind CSS & ShadCN UI**
- **Genkit** (AI Analysis)
- **Firebase** (Firestore & Authentication)
- **Paystack** (Payment Processing)
