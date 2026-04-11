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

## 🔗 Live Link : Employer login
[Employer Login ](https://online-assessment-platform-rho.vercel.app/login) 
**Login Credentials:**
- Employer: `admin@akij.com` / `password123`

## 🔗 Live Link : Candidate login
[Candidate Login ](https://online-assessment-platform-rho.vercel.app/candidate/login) 

**Login Credentials:**
- Candidate: `candidate@example.com / candidate123`

## 🔗 Video Demo
[Watch demo ](https://drive.google.com/file/d/1dR9L3QT1AvyKAfnBxGw1HgjOYoy11rNE/view?usp=drive_link) 


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
**I haven’t directly worked with Model Context Protocol (MCP), but I’ve built systems that follow similar ideas—like integrating APIs, real-time data, chat systems, and backend services. For example, in Aponjon,CareerConnect and Nirapod project. I handled real-time communication, notifications, and service integration. So I’m confident I can quickly learn and work with MCP.**

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
.
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── public/
│   ├── logo.png
│   ├── tick.png
│   └── empty-state.png
└── src/
	├── app/
	│   ├── layout.jsx
	│   ├── global.css
	│   ├── page.jsx
	│   ├── create-test/
	│   │   └── page.jsx
	│   ├── dashboard/
	│   │   └── page.jsx
	│   ├── login/
	│   │   └── page.jsx
	│   ├── manage-test/
	│   │   └── [id]/page.jsx
	│   └── candidate/
	│       ├── dashboard/page.jsx
	│       ├── exam/[id]/page.jsx
	│       ├── login/page.jsx
	│       └── result/page.jsx
	├── components/
	│   ├── forms/
	│   │   ├── QuestionForm.jsx
	│   │   └── BasicInfoForm.jsx
	│   ├── layout/
	│   │   └── Navbar.jsx
	│   └── ui/
	│       ├── Button.jsx
	│       ├── Card.jsx
	│       ├── Input.jsx
	│       └── Modal.jsx
	├── lib/
	│   └── validation.js
	└── store/
		├── authStore.js
		└── examStore.js

```



