# Kitchen Prof 🍳

Kitchen Prof is an intelligent food cost control and margin analysis platform designed specifically for the volatile restaurant market in Lagos, Nigeria.

## 📥 How to Download This Project
To take your code with you:
1. Click the **Download** icon in the top-right corner of the Firebase Studio interface.
2. Save the ZIP file to your computer.
3. Unzip the folder to access all source code, configurations, and AI flows.

## 🚀 First Time Admin Setup
To access the global administrative features:
1. Navigate to the **Login** page.
2. Click the link that says **"Don't have an account? Sign Up"**.
3. Register using the administrative email: `chefdtanju@gmail.com`.
4. Choose any secure password. 
5. The system will automatically detect this email and grant you **Platform Admin** status across the dashboard and settings.

## 🛠️ Portability & Running Locally
This app is built on a standard modern stack (Next.js 15, Firebase, Tailwind). If you ever move away from Firebase Studio, your code remains fully functional and portable.

### Running Locally
1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.
2. **Install Dependencies**: Open your terminal in the project folder and run:
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env.local` file. Copy the keys from `src/firebase/config.ts` into this file following standard Next.js environment variable naming (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY=...`).
4. **Start Development**: Run:
   ```bash
   npm run dev
   ```
5. **Genkit UI**: To test AI prompts locally, run:
   ```bash
   npm run genkit:dev
   ```

## 🖼️ Branding (How to Swap the Logo)
To change the app's logo and icon across all screens:
1. Upload your new image to the `public/` folder (e.g., name it `my-logo.png`).
2. Open `src/app/lib/placeholder-images.json`.
3. Update the `imageUrl` for the `app-logo` entry to point to your new file (e.g., `"/my-logo.png"`).
4. Alternatively, if logged in as Admin, use the **Settings** page to update the logo dynamically via the Admin Panel.

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
