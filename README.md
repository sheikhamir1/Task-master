## 📋 Task Master – Documentation

### 🧠 Overview

**Task Master** is a modern task management web application built with **React**, **Firebase Firestore**, and **Context API**. It enables users to create, manage, complete, delete, and restore tasks with real-time updates and persistent storage. The app also features a **Dark Mode toggle**, **animated loading spinners**, and intuitive filtering options for an enhanced user experience.

---

### 🚀 Features

- ✅ **Add, Complete, Delete, Restore Tasks**
- 🌑 **Dark/Light Mode Toggle**
- 🔄 **Real-time updates via Firebase Firestore**
- 🔁 **Soft Delete with Trash Bin and Restore**
- 🧠 **Context-based Task Filtering**
- 🌀 **Loading Spinner with UI Blocking (react-spinners)**
- 🛠️ **Firebase as Backend (No localStorage)**

---

### 🛠️ Tech Stack

| Frontend | Backend            | State Management | Styling      | Utilities      |
| -------- | ------------------ | ---------------- | ------------ | -------------- |
| React    | Firebase Firestore | Context API      | Tailwind CSS | react-spinners |

---

### 🗂️ Folder Structure

```
src/
├── components/          # Reusable UI components (TaskItem, Spinner, etc.)
├── context/             # Theme and Task context providers
├── pages/               # Main UI pages (Home, Trash, etc.)
├── hooks/               # Custom hooks (e.g. useTasks)
├── styles/              # Tailwind CSS and global styles
├── utils/               # Firebase config and helpers
└── App.jsx              # Root component
```

---

### ⚙️ Firebase Setup

1. Create a Firebase project.
2. Enable **Cloud Firestore**.
3. Copy the config and set up Firebase:

```js
// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_domain",
  projectId: "your_project_id",
  storageBucket: "your_bucket",
  messagingSenderId: "your_id",
  appId: "your_app_id",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

### 🔌 State Management

#### Theme Context

```jsx
document.documentElement.classList.add("dark");
```

- Uses `localStorage` for theme persistence.
- Applies Tailwind’s `dark` class to `<html>`.

#### Task Context

- Manages global task state.
- Supports filtering, trash, and status updates.
- Syncs all state with Firestore.

---

### 🔁 Task Flow Logic

#### ➕ Add Task

- Writes to Firestore.
- Immediately reflects in the UI via real-time updates.

#### ✅ Mark as Complete

- Updates `isCompleted` flag in Firestore.

#### 🗑️ Move to Trash

- Updates `isTrashed` flag instead of deleting.

#### ♻️ Restore from Trash

- Resets `isTrashed` to `false`.

#### ❌ Permanent Delete

- Deletes task document from Firestore.

---

### 🎨 Dark Mode

- Controlled via `ThemeContext`.
- Stored in `localStorage`.
- Applied globally using `dark:` Tailwind classes.

---

### ⏳ Loading Spinner

- Uses `react-spinners` (e.g. `ClipLoader`) with full-screen overlay.
- Spinner activates during Firebase operations:
  - Adding, Updating, Deleting, Restoring Tasks

---

### ✅ Filters

You can filter tasks by:

- **All Tasks**
- **Completed**
- **Incomplete**
- **Trashed**

Filtering is implemented using the Context API + local state for UI logic.

---

### 🧪 Testing & Debugging Tips

- Clear `localStorage` and Firebase cache for a fresh start.
- Check for Firestore rules if tasks aren't syncing.
- Ensure `ThemeProvider` wraps `App` in `main.jsx`.

---

### 💡 Future Improvements (Optional)

- ✅ Authentication (Google Sign-In)
- 🔔 Notifications & Reminders
- 📅 Due Dates & Calendar View
- 📊 Task Stats Dashboard
- 📱 PWA Support for Mobile

---
