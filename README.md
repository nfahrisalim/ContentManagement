# 📁 ContentManagement

A modern web application for managing projects including creation, updating, deletion, and markdown-based content built with **React**, **Tailwind CSS**, and **Express.js**.

---

## 🧾 Project Overview

**ContentManagement** is a user-centric platform designed to manage projects efficiently. It includes features that support project organization, content editing via Markdown, and potential blog integration. The system is architected to offer a seamless development experience for both frontend and backend.

---

## ✨ Key Features

* 🔧 **Create, update, and delete** projects with ease
* 📝 **Markdown Editor** for rich text project descriptions
* 📂 **Blog Integration** possibility for extended content management
* 🔍 **API status page** showing endpoint responses
* ⚡ **Real-time UX** with react-query-based fetching and caching
* ✅ **Form validation** using Zod and React Hook Form

---

## 🛠️ Tech Stack

### Frontend

| Tool                      | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| **React + TypeScript**    | Frontend framework with static typing    |
| **Tailwind CSS**          | Utility-first CSS styling framework      |
| **React Hook Form + Zod** | Form handling and validation             |
| **react-query**           | Data fetching, caching, and revalidation |
| **Markdown Editor**       | Rich text content input for projects     |
| **Vite**                  | Fast frontend tooling and dev server     |
| **Icon Libraries**        | UI icons like `BookOpen`, `FolderOpen`   |

### Backend

| Tool                    | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| **Express.js**          | Web server for API routing                            |
| **Zod**                 | Request validation for input safety                   |
| **(Optional)** Database | Persistent project storage (e.g., PostgreSQL/MongoDB) |

---

## 📁 Folder Structure Highlights

| File/Folder                         | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| `client/src/pages/project-form.tsx` | Page with project form and validation logic   |
| `client/src/hooks/use-projects.ts`  | Hooks for CRUD project operations             |
| `server/routes.ts`                  | Defines backend routes for project operations |
| `components.json`                   | Includes Tailwind setup and UI components     |
| `vercel.json`                       | Indicates Vite build and deploy configuration |

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm or pnpm
* (Optional) MongoDB/PostgreSQL for data storage

### Installation

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Development

```bash
# Run frontend
cd client
npm run dev

# Run backend
cd ../server
npm run dev
```

### Deployment

This project is configured for **Vercel** using Vite. Ensure both `client` and `server` are deployed correctly, or adapt to full-stack deployment (e.g., with Railway, Render, or Docker).

---
