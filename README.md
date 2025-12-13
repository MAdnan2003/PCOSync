📦 BACKEND – Installed Packages

Run these inside backend/

npm init -y

✅ Core server
npm install express

✅ Environment variables
npm install dotenv

✅ Database (MongoDB)
npm install mongoose

✅ Authentication
npm install jsonwebtoken
npm install bcryptjs

✅ CORS & middleware
npm install cors

✅ HTTP requests (OpenWeather, APIs)
npm install axios

✅ Scheduled jobs (environment monitoring)
npm install node-cron

✅ Development tools
npm install --save-dev nodemon

📌 Backend package.json dependencies (FINAL EXPECTED)
{
  "dependencies": {
    "axios": "^1.x",
    "bcryptjs": "^2.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^4.x",
    "jsonwebtoken": "^9.x",
    "mongoose": "^8.x",
    "node-cron": "^3.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}

📦 FRONTEND – Installed Packages

Run these inside frontend/

✅ Create app (Vite + React)
npm create vite@latest frontend
cd frontend
npm install


Choose:

Framework: React

Variant: JavaScript

✅ Routing
npm install react-router-dom

✅ HTTP requests
npm install axios

✅ Icons
npm install lucide-react

✅ Styling (Bootstrap)
npm install bootstrap


Import once in main.jsx:

import "bootstrap/dist/css/bootstrap.min.css";

📌 Frontend package.json dependencies (FINAL EXPECTED)
{
  "dependencies": {
    "axios": "^1.x",
    "bootstrap": "^5.x",
    "lucide-react": "^0.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  }
}

🔑 ENV FILES YOU MUST HAVE
📍 backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pcos-sync
JWT_SECRET=your_secret_key
OPENWEATHER_API_KEY=your_openweather_key
NODE_ENV=development

✅ HOW TO VERIFY EVERYTHING IS INSTALLED
Backend
cd backend
npm list --depth=0

Frontend
cd frontend
npm list --depth=0

🚀 HOW TO RUN THE PROJECT
Backend
cd backend
npm run dev

Frontend
cd frontend
npm run dev
