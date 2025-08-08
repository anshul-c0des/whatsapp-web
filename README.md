# WhatsApp Clone

A WhatsApp Web-like chat application built with React, React Router, Tailwind CSS, and a backend API.

It features chat list, real-time messaging UI (without WebSockets yet), emoji picker, search, responsive design, and message input with rich text features.

---

## 🚀 Tech Stack

- React 18+ (with hooks & React Router)
- Tailwind CSS (Utility-first styling)
- React Icons (UI icons)
- emoji-mart (Emoji picker)
- moment.js (Date/time formatting)
- Vite (Frontend build tool)
- Express (Backend API - optional)
- Node.js (Backend runtime)
- MongoDB (Database)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/whatsapp-clone.git
cd whatsapp-clone/frontend-vite
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables
Create a .env file at the root of your backend and frontend folders (if any), for example:

```bash
VITE_API_BASE_URL=http://localhost:5000
```
Adjust the backend URL as needed.

4. Run the development servers
For the frontend:

```bash
npm run dev
# or
yarn dev
```
For the backend (if included):

```bash
node server.js
# or your backend start script
```
Open http://localhost:3000 (or the port shown) in your browser.

---

## Features
- ✅ Responsive UI mimicking WhatsApp Web, including mobile view
- ✅ Chat list with search functionality
- ✅ Chat window with message input supporting emojis and dynamic textarea
- ✅ Realistic timestamps using moment.js
- ✅ Clean UI with Tailwind CSS and React Icons
- ✅ Navigation using React Router and URL params
- ✅ Basic message sending with UI update in chat list

---

# Live Demo(https://whatsapp-web-tau.vercel.app/chat/929967673820)
