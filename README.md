# AI-Powered FAQ Web App

A modern web application built with Next.js and FastAPI that provides an interactive experience with ai faq powered by Google's Generative AI.

## 🚀 Features

- AI powered FAQ answers
- Interactive analytics dashboard with real-time data visualization
- AI-powered insights and recommendations using Google's Generative AI
- Modern, responsive UI built with Tailwind CSS
- RESTful API backend with FastAPI
- Database integration with SQLAlchemy
- Type-safe development with TypeScript

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Radix UI components
- Google Generative AI integration

### Backend
- FastAPI
- SQLAlchemy
- Alembic for database migrations
- Python 3.x
- MySQL database

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MySQL database
- Google AI API key

## 🚀 Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   GOOGLE_AI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your environment variables in a `.env` file:
   ```
   DATABASE_URL=mysql://user:password@localhost/dbname
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

## 📁 Project Structure

```
├── my-app/                 # Frontend Next.js application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── components/        # React components
│
└── backend/               # FastAPI backend
    ├── routes/            # API routes
    ├── services/          # Business logic
    ├── db/                # Database models
    └── migrations/        # Database migrations
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `uvicorn main:app --reload` - Start development server
- `alembic upgrade head` - Run database migrations

## 🔐 Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `GOOGLE_AI_API_KEY` - Google AI API key

### Backend (.env)
- `DATABASE_URL` - MySQL database connection string

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 