---
description: How to deploy RolePath AI to Firebase App Hosting
---

# Deploying RolePath AI

This project is configured to use [Firebase App Hosting](https://firebase.google.com/docs/app-hosting), which is a serverless hosting solution designed for Next.js apps.

## Prerequisites

1.  **Firebase Project**: You need a Firebase project.
2.  **Blaze Plan**: Your Firebase project must be on the Blaze (pay-as-you-go) plan.
3.  **GitHub Repository**: App Hosting works by connecting to your GitHub repository.

## Steps to Deploy

1.  **Push to GitHub**: Ensure your latest code (including the fixes we made) is pushed to a GitHub repository.
2.  **Go to Firebase Console**: Visit the [Firebase Console](https://console.firebase.google.com/).
3.  **App Hosting**: Navigate to "App Hosting" in the left menu.
4.  **Get Started**: Click "Get Started" and follow the prompts to connect your GitHub account.
5.  **Select Repository**: Choose the repository containing RolePath AI.
6.  **Configure Settings**:
    *   **Root Directory**: Leave as `/` (default).
    *   **Live Branch**: Select `main` (or your working branch).
7.  **Environment Variables**:
    *   You MUST add your `GOOGLE_API_KEY` here.
    *   Key: `GOOGLE_API_KEY`
    *   Value: Your API key (from your `.env` file).
8.  **Deploy**: Click "Finish and Deploy".

Firebase will now build and deploy your application. Future pushes to your selected branch will automatically trigger a new deployment.
