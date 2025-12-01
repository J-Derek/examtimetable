# Deployment Guide

Since your app is now a **Static Site**, you can host it for **FREE** on platforms like Vercel or Netlify.

## Option 1: Vercel (Recommended)

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com) and log in with GitHub.
3.  **Add New Project**: Click "Add New..." -> "Project".
4.  **Import Repository**: Select your `lookup` repository (or whatever you named it on GitHub).
5.  **Configure Project**:
    -   **Root Directory**: Click "Edit" and select `new code/daystar-exam-hub-main`.
    -   **Framework Preset**: It should auto-detect "Vite".
    -   **Build Command**: `npm run build` (default).
    -   **Output Directory**: `dist` (default).
6.  **Deploy**: Click "Deploy".

## Option 2: Netlify

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Sign Up/Login**: Go to [netlify.com](https://netlify.com) and log in with GitHub.
3.  **Add New Site**: Click "Add new site" -> "Import from existing project".
4.  **Select Repository**: Choose GitHub and select your repository.
5.  **Configure Build**:
    -   **Base directory**: `new code/daystar-exam-hub-main`
    -   **Build command**: `npm run build`
    -   **Publish directory**: `dist`
6.  **Deploy**: Click "Deploy site".

## Manual Upload (No GitHub)

If you don't want to use GitHub:
1.  Run `npm run build` inside `new code/daystar-exam-hub-main`.
2.  This will create a `dist` folder.
3.  Drag and drop this `dist` folder onto the [Netlify Drop](https://app.netlify.com/drop) page.
