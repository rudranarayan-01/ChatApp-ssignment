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

- Database: SQLite with SQLAlchemy ORM.