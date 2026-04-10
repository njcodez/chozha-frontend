# Project Chozha — Web Frontend

Next.js-based web interface for Tamil inscription binarization. Light-themed, fully responsive design with admin configuration panel.

## ✨ Features

- 🎨 **Light Theme** — Stone/amber/blue color scheme with Tailwind CSS
- 📱 **Fully Responsive** — Mobile, tablet, desktop optimized
- 🗂️ **Dual Feed** — "My Work" (personal) and "Public Feed" (community)
- 📸 **Upload** — Drag-drop + mobile camera capture
- 🎬 **Live Processing** — Real-time status with animated stepper
- 🎚️ **Comparison Slider** — Touch/mouse-friendly before/after viewer
- 📝 **Job Metadata** — Title, description, visibility control
- ⚙️ **Admin Panel** — Password-protected API URL configuration
- 🌐 **Firebase Integration** — Dynamic configuration from Firestore

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI**: shadcn/ui (headless components)
- **Fonts**: Google Fonts (Catamaran + Inter)
- **Database**: Firebase Firestore (config only)
- **HTTP**: Fetch API
- **Storage**: Cookies (username), Firestore (API URL)
- **Utilities**: date-fns, js-cookie

## 🚀 Installation

```bash
# Clone repository
git clone https://github.com/njcodez/chozha-frontend.git
cd chozha-frontend

# Install dependencies
pnpm install

# Install shadcn components
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input textarea badge tabs dialog toggle
```

## 🔐 Environment Setup

Create `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-chozha
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Panel
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

Get Firebase credentials from [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps (Web).

## 💻 Running Locally

### Prerequisites

1. **Backend running**: `docker compose up cloudflared api` (from backend repo)
2. **Firebase configured**: Firestore with `config/api_link` document
3. **Node.js 18+** and **pnpm** installed

### Start Dev Server

```bash
pnpm dev
# Open http://localhost:3000
```

### First-time Setup

1. **Admin Panel**: Go to `http://localhost:3000/admin`
2. **Enter password**: From `NEXT_PUBLIC_ADMIN_PASSWORD`
3. **Update API URL**: Enter your backend URL (local or Cloudflare tunnel)
4. **Confirm**: Success toast, Firestore updated

Now the app uses that URL for all API calls.

## 📄 Pages

### `/` — Home
- **Splash Screen** (2 sec): Shows "Project Chozha" in Catamaran font
- **Username Screen**: Text input + check availability
- **Home Feed**: 
  - Tab 1: "My Work" — Your jobs grid
  - Tab 2: "Public Feed" — Community jobs
  - Sort toggle for public feed
  - FAB button → Upload

### `/upload` — Upload
- Drag-drop zone + browse button
- Mobile camera input
- Image preview
- Username display (from cookie)
- Process button → Creates job, redirects to result page

### `/job/[id]` — Result
- **Processing**: Input image with pulsing overlay, status stepper, live polling (3s intervals)
- **Done**: Before/after comparison slider
- **Failed**: Error message display
- **Metadata Form**: Title, description, public toggle, save button
- **Download**: Get processed image
- **Delete**: Password-protected deletion

### `/admin` — Admin Panel
- Password entry → Unlock
- API URL input field
- Update button → Writes to Firestore
- Success toast notification

## 🔌 API Integration

Fetches base URL from Firestore `config/api_link` document. Falls back to `http://localhost:8000`.

### Endpoints Used

```
GET  /health
GET  /usernames/check?username={name}
GET  /jobs
GET  /jobs?username={username}
POST /jobs (FormData)
PATCH /jobs/{id} (JSON)
DELETE /jobs/{id} (JSON with master_password)
```

## 🎨 Design System

### Colors
- **Primary**: Stone (200-800)
- **Success**: Green
- **Warning**: Amber
- **Error**: Red
- **Status**: Blue (processing), Green (done), Amber (queued), Red (failed)

### Components
- **Input**: Tailwind-styled text inputs
- **Button**: shadcn button with variants
- **Card**: Border + shadow, hover effects
- **Badge**: Status chips with color coding
- **Tabs**: shadcn tabs for feed switching
- **Dialog**: shadcn dialog for modals

## 🔄 State Management

- **React Hooks**: useState, useEffect, useCallback
- **Firebase**: Real-time reads from Firestore
- **Cookies**: js-cookie for username persistence
- **URL Search Params**: For sorting/filtering on public feed

## 📦 Build & Deploy

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# Set env vars in Vercel dashboard:
# - All NEXT_PUBLIC_FIREBASE_* variables
# - NEXT_PUBLIC_ADMIN_PASSWORD
```

## 🐛 Troubleshooting

### "Could not reach server"
- Verify backend is running: `docker compose ps`
- Check Firestore `config/api_link` has correct URL
- Test: `curl http://localhost:8000/health`

### CORS Errors
- Backend needs CORS enabled for `http://localhost:3000`
- Production: Add your Vercel domain to backend CORS

### Images Not Loading
- Verify backend is serving images
- Check Firestore URL is accessible
- Clear browser cache

### Admin Panel Not Updating
- Ensure Firebase env vars are correct
- Check Firestore security rules allow reads
- Verify password is correct

## 📱 Responsive Design

- **Mobile (<640px)**: Single-column grid, stacked forms
- **Tablet (640-1024px)**: 2-3 column grid, side-by-side forms
- **Desktop (>1024px)**: Full grid, optimized spacing

## ⚡ Performance

- **Image Caching**: Browser caches thumbnails
- **Lazy Loading**: Job cards load on scroll
- **Code Splitting**: Routes split automatically
- **Optimized Images**: Next.js Image component (when needed)

## 🔐 Security

- **Admin Password**: Hashed in frontend (stored as plain env var for simplicity)
- **Cookie Secure**: Username cookie uses sameSite=lax
- **HTTPS**: Required for production (Vercel enforces)
- **CORS**: Backend validates origin

---

**For project overview**: See [Common README](./README.md)  
**For backend details**: See [Backend README](../chozha-backend/README.md)  
**For mobile app**: See [Flutter README](../chozha-flutter/README.md)