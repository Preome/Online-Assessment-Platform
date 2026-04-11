# 🧪 Online Assessment Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg?style=flat&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg?style=flat&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue.svg?style=flat&logo=tailwind)](https://tailwindcss.com)

## 🚀 Overview
A full-stack online assessment/exam platform built with Next.js 14 (App Router), TailwindCSS, Zustand, React Hook Form & Zod. 

**Key Features:**
- **Admin**: Login → Dashboard → Create Test (basic info + MCQ questions) → Manage/Edit/Delete Tests
- **Candidate**: Login → Dashboard (active/upcoming exams) → Start Exam (fullscreen, timer, tab-switch detection, auto-submit)
- Secure exam env: Visibility API for tab switches, fullscreen enforcement, local progress save (localStorage)
- Responsive UI with shadcn/ui-inspired components (Button, Card, Input, Modal)

## 🔗 Live Link
[Link ](https://loom.com/share/...) 

## 🔗 Video Demo
[Watch demo ](https://loom.com/share/...) 

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+

### Quick Start
```bash
git clone <your-repo-url>
cd "Online Assessment Platform"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Login Credentials:**
- Admin: `admin@akij.com` / `password123`
- Candidate: `candidate@example.com / candidate123`


### Build & Deploy
```bash
npm run build
npm start
```



## 🤖 Additional Questions

### MCP Integration
**No prior MCP experience in production projects.**

**Idea for this project:**
- **Figma MCP**: Auto-import UI designs to generate Tailwind components/code for exam UI variants.
- **Supabase MCP**: Realtime DB access for live exam syncing, result submission without custom API.
- **Chrome DevTools MCP**: Automated browser testing for exam proctoring features (tab detection, fullscreen).
Benefits: Faster iteration, realtime data, integrated testing.

### AI Tools for Development
- **GitHub Copilot**: Autocomplete for React/Next.js components, Zustand stores, Zod schemas – sped up 2x.


### Offline Mode
**Current partial support:** Exam loads from localStorage, timer/answers persist client-side, works briefly offline.

**Full offline handling:**
1. **PWA/Service Worker**: Register SW to cache questions/UI/assets (`next-pwa` plugin).
2. **IndexedDB** (via Dexie.js): Store questions/answers offline; exam progresses fully.
3. **Background Sync**: On reconnect, POST answers to server via `navigator.onLine` check + SW sync.
4. **UI Fallback**: Offline banner, cached timer persists, auto-resume.
5. **Proctoring**: Local tab-switch count survives offline.




## 📂 Project Structure
```
src/
├── app/          # Pages: login, dashboard, create-test, candidate/exam/[id]
├── components/   # UI (shadcn-inspired), forms, layout
├── store/        # Zustand: auth, exam
└── lib/          # Validation schemas

```



