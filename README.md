
# Kitchen Prof 🍳

**Managing margins for food business.**

Kitchen Prof (Kitchen Profit Professional) is an intelligent food cost control and margin analysis platform built on a serverless, global-scale architecture.

## 📥 How to Export & Download Your Code

If you are ready to take this project to production, follow these steps to download the source code:

### Option 1: Export to GitHub (Recommended)
- Since you can see the **"Export to GitHub"** button on the bottom left, click it!
- Follow the prompts to connect your GitHub account.
- This will create a repository with all your code, which you can then "Clone" or "Download ZIP" directly from GitHub.

### Option 2: Direct ZIP Download
- Look at the **Top Right Corner** of the entire browser window (the main Firebase Studio header).
- Look for an icon that looks like a **Cloud with a Downward Arrow** or a button that says **"Export"**.
- **If you can't see it:**
  - Try zooming out your browser (Ctrl + minus or Cmd + minus).
  - Ensure you are not in a full-screen code editor mode that hides the main toolbar.
  - Refresh the page and look at the very top header bar.

## 🚀 Launching to Production

### 1. Secret Keys
- Create a `.env.local` file in your project root.
- Add your `GEMINI_API_KEY`. Get your key from [aistudio.google.com](https://aistudio.google.com/).

### 2. Firebase Production Setup
- **Console**: Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
- **Services**: Enable **Firestore** (Production Mode) and **Authentication** (Email/Password & Anonymous).
- **Config**: Update `src/firebase/config.ts` with the keys from your new Firebase Project settings.

### 3. Deploy to the Web
- **GitHub**: Push your code to a private or public GitHub repository.
- **App Hosting**: In the Firebase Console, connect the repository to **Firebase App Hosting**. It will automatically handle the build and deployment.

## 🔐 Support & Administration
- **Default Admin**: `chefdtanju@gmail.com` has root access to the Diagnostic Console and Marketing AI Lab.
- **Recruitment Support**: `kitchenprof@gmail.com` (24-hour response time).
