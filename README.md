
# Kitchen Prof 🍳

Kitchen Prof is an intelligent food cost control and margin analysis platform designed specifically for the volatile restaurant market in Lagos, Nigeria.

## 📥 How to Download This Project
To take your code with you and add your own photos:
1. Click the **Download** icon in the top-right corner of the Firebase Studio interface.
2. Save the ZIP file to your computer.
3. Unzip the folder.
4. **To add your logo**: Place your image file (e.g., `logo.png`) into the `public/` folder.
5. In the app's Admin Settings, set the Logo URL to `"/logo.png"`.

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

## 🖼️ Branding (How to Swap the Logo)
To change the app's logo across all screens:
1. **Option A (Data URI)**: Convert your image to a Base64 string online and paste it into the Logo URL field in Settings.
2. **Option B (Public Folder)**: If running locally, put `my-logo.png` in the `public/` folder and use the path `"/my-logo.png"` in Settings.

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
