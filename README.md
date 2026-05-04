
# Kitchen Prof 🍳

**Managing margins for food business.**

Kitchen Prof (Kitchen Profit Professional) is an intelligent food cost control and margin analysis platform built on a serverless, global-scale architecture.

## 🚀 Post-Export: Getting Started on Your Laptop

Now that you have exported the code to GitHub, follow these steps to run it locally:

### 1. Clone & Install
- Open your terminal and clone the repository: `git clone <your-repo-url>`
- Navigate into the folder: `cd kitchen-prof`
- Install dependencies: `npm install`

### 2. Environment Setup
- Create a file named `.env.local` in the root folder.
- Add your Gemini API Key: `GEMINI_API_KEY=your_key_here` (Get it from [aistudio.google.com](https://aistudio.google.com/)).
- Add your Firebase config if you are using a custom project.

### 3. Run Development Server
- Start the app: `npm run dev`
- Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🔐 Launching to Production

### 1. Firebase Setup
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project.
- Enable **Firestore** and **Authentication** (Email/Password & Anonymous).
- Update `src/firebase/config.ts` with your new project's web config.

### 2. Deployment
- **App Hosting**: Connect your GitHub repository to **Firebase App Hosting** in the console. It will automatically build and deploy your Next.js app.
- **Security Rules**: Copy the content of `firestore.rules` from this project into the "Rules" tab of your Firestore database in the Firebase Console.

## 🔐 Support & Administration
- **Default Admin**: `chefdtanju@gmail.com` has root access to the Diagnostic Console and Marketing AI Lab.
- **Recruitment Support**: `kitchenprof@gmail.com` (24-hour response time).
- **Legal**: `legal@kitchenprof.ng`
