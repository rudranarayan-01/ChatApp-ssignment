# LocalChat: A Private, Full-Stack Conversational App
Welcome to LocalChat! This is a ChatGPT-like application built from the ground up to be entirely self-contained. It doesn't rely on OpenAI or any external APIs—everything from the "brain" of the bot to the database lives right on your machine.

I built this to explore the core architecture of real-time messaging, secure user authentication, and persistent data storage.

## Key Features
- Custom "AI" Logic: A completely local response engine built in Python. No API keys, no costs, and total privacy.

- User Isolation: A full Login/Signup system ensures that your conversations stay yours. Users cannot see each other's chat histories.

- Survivability: Uses an SQLite database to ensure that even if you restart your computer or the server, your messages and sessions are right where you left them.

- Interactive UI: A modern, dark-themed interface with "thinking" indicators, auto-scrolling, and responsive sidebar management.

- Clean REST API: Built with FastAPI, featuring automatic documentation and clear separation of concerns.

## The Tech Stack
- Frontend: React.js, Tailwind CSS (Styling), Lucide-React (Icons), Axios (API calls).

- Backend: Python, FastAPI (Web Framework).

- Database: SQLite with SQLAlchemy

## 🛠️ Local Setup Instructions
### Backend Setup
1. Navigate to the backend folder:
```
    cd backend
```
2. Create and activate your virtual environment:
```
    python -m venv chatenv
    # Windows:
    chatenv\Scripts\activate
    # Mac/Linux:
    source chatenv/bin/activate
```

3. Install dependencies:
```
    pip install -r requirements.txt
```

4. Run the server:
```
    uvicorn main:app --reload
```
The backend will be live at http://localhost:8000.

### . Frontend Setup

1. In a new terminal, navigate to the frontend folder:
```
    cd frontend
```

2. Install packages:
```
    npm install
```

3. Start the development server:
```
    npm run dev
```
The UI will be live at http://localhost:5173.


## 🐳 Docker Setup (Recommended for Deployment)
If you have Docker installed, you can launch the entire system with one command from the root folder:
```
    docker-compose up --build
```
- Frontend: http://localhost

- Backend: http://localhost:8000

## 📖 Usage Guide
1. Register/Login: Create an account on the landing page. Your password is encrypted immediately.
    For testing you can login as
    ``` username : test_user_01
        password: test_user_pwd_01
    ```

2. Start a Conversation: Use the + New Chat button in the sidebar to create a fresh session.

3. Messaging: Type your message in the input field. The bot uses a local intent-mapping engine to respond.

4. Auto-Save: You can close your browser or restart the server; your messages are safely stored in the backend/data folder.

5. Log Out: Use the logout button in the bottom left of the sidebar to end your session.

Live URL: https://chat-frontend-yp4k.onrender.com