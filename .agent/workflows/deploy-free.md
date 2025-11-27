---
description: How to deploy RolePath AI to Vercel (Free Tier)
---

# Deploying RolePath AI to Vercel (Free)

[Vercel](https://vercel.com) is the creators of Next.js and offers a generous free "Hobby" tier that is perfect for personal projects like this.

## Prerequisites

1.  **Vercel Account**: Sign up for free at [vercel.com](https://vercel.com/signup).
2.  **GitHub Account**: You likely already have this.
3.  **GitHub Repository**: Your code must be pushed to a GitHub repository.

## Steps to Deploy

1.  **Push to GitHub**: Ensure your latest code is pushed to a GitHub repository.
2.  **Go to Vercel Dashboard**: Log in to your Vercel account.
3.  **Add New Project**: Click "Add New..." -> "Project".
4.  **Import Git Repository**: Find your `RolePathAI` repository in the list and click "Import".
5.  **Configure Project**:
    *   **Framework Preset**: It should automatically detect "Next.js".
    *   **Root Directory**: Leave as `./`.
6.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add your API key:
        *   **Key**: `GOOGLE_API_KEY`
        *   **Value**: Your API key (copy from your local `.env` file).
7.  **Deploy**: Click "Deploy".

Vercel will build your application and provide you with a live URL (e.g., `rolepath-ai.vercel.app`) in a minute or two.

## Why Vercel?

*   **Free Tier**: The Hobby plan is free forever for personal use.
*   **Native Support**: Built by the Next.js team, so it supports all features out of the box.
*   **Fast**: Global edge network for fast loading.
