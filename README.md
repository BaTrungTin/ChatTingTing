# 💬 Chat Ting Ting App

A real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

## ✨ Features

- 🔐 **Authentication** - Sign up, login, logout
- 💬 **Real-time Messaging** - Instant message delivery
- 📸 **Image Sharing** - Send images in chat
- 😊 **Emoji Support** - Send emojis in messages
- 👤 **Profile Management** - Update profile picture
- 📱 **Responsive Design** - Works on mobile and desktop
- 🌙 **Dark/Light Theme** - Beautiful UI with DaisyUI

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation
- **Emoji Picker React** - Emoji selection

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload (optional)

## 🚀 Quick Start

### For Beginners (Step-by-Step Guide)

If you're new to development, follow these steps:

1. **Install Node.js:**
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the "LTS" version
   - Run the installer and follow the instructions
   - Restart your computer

2. **Install MongoDB Atlas (Free):**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (choose the free tier)
   - Get your connection string

3. **Download the Project:**
   - Click the green "Code" button on GitHub
   - Select "Download ZIP"
   - Extract the ZIP file to your desktop

4. **Open Terminal/Command Prompt:**
   - **Windows:** Press `Win + R`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
   - **Linux:** Press `Ctrl + Alt + T`

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas)
- **Terminal/Command Prompt** (Windows) or **Terminal** (Mac/Linux)

### 1. Get the Project

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/your-username/chat-ting-ting-app.git
cd chat-ting-ting-app
```

**Option B: Download ZIP**
1. Click the green "Code" button on GitHub
2. Select "Download ZIP"
3. Extract the ZIP file to your desired location
4. Open terminal/command prompt in the extracted folder

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
```

**Note:** If you're on Windows and using Command Prompt, use `dir` instead of `ls` to list files.

Create a `.env` file in the `backend` directory:

```env
PORT=5001
MONGODB_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/chat-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Note:** 
- Replace `your-username`, `your-password`, and `your-cluster` with your MongoDB Atlas credentials
- Generate a secure JWT_SECRET (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Cloudinary is optional - if not provided, images will be stored as base64

```bash
# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

**Note:** Keep both backend and frontend terminals running simultaneously.

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and go to `http://localhost:5173`

## 📁 Project Structure

```
chat-ting-ting-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── message.controller.js
│   │   ├── lib/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── socket.js
│   │   │   └── utils.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── message.route.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoChatSelected.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── skeletons/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── store/
│   │   │   ├── useAuthStore.js
│   │   │   ├── useChatStore.js
│   │   │   └── useThemeStore.js
│   │   ├── lib/
│   │   │   └── axios.js
│   │   ├── utils/
│   │   │   └── emojiUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Configuration

### MongoDB Setup

1. **Local MongoDB:**
   ```env
   MONGODB_URL=mongodb://localhost:27017/chat-app
   ```

2. **MongoDB Atlas:**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Replace the MONGODB_URL in .env

### Cloudinary Setup (Optional)

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to your .env file

If Cloudinary is not configured, images will be stored as base64 in the database.

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Set environment variables in your hosting platform
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Update the API URL in production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check your MONGODB_URL in .env
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify your username and password

2. **Port Already in Use:**
   - Change the PORT in .env file
   - Kill the process using the port: `npx kill-port 5001`

3. **Socket Connection Failed:**
   - Ensure backend is running on the correct port
   - Check CORS configuration
   - Verify Socket.IO version compatibility

4. **Image Upload Issues:**
   - Check Cloudinary credentials
   - Verify file size limits
   - Check network connectivity

5. **Command Not Found (Windows):**
   - Make sure Node.js is installed and added to PATH
   - Try using `npm.cmd` instead of `npm`
   - Restart Command Prompt after installing Node.js

6. **Permission Denied (Mac/Linux):**
   - Use `sudo npm install` if needed
   - Check folder permissions

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check if MongoDB is running and accessible
5. Make sure you're in the correct directory when running commands
6. Try running `npm install` again if you get module errors

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [DaisyUI](https://daisyui.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [MongoDB](https://www.mongodb.com/) for database
- [Cloudinary](https://cloudinary.com/) for image hosting

---

**Happy Chatting! 💬✨**