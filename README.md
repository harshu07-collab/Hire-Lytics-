# Hire-Lytics – AI Resume Intelligence

Hire-Lytics is an AI-powered resume analysis platform designed for modern professionals. It helps optimize resumes with instant ATS score analysis, formatting suggestions, and AI-powered rewriting tools.

## Features

- **Resume Analysis**: Instant scoring and feedback on your resume.
- **ATS Optimization**: Ensure your resume is readable by Applicant Tracking Systems.
- **AI Rewriting**: Use AI to improve your resume content and impact.
- **Optimization Checklist**: Track 16 crucial metrics across 5 categories.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (3.9 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Optional: The app will use mock data if MongoDB is not running)

## How to Run Locally

### 1. Install Dependencies

Open a terminal in the project root and run:

```powershell
npm run install:all
```

This will install both frontend and backend dependencies.

### 2. Start the Backend

In one terminal window, run:

```powershell
npm run dev:backend
```

The backend server will start at [http://localhost:8000](http://localhost:8000).

### 3. Start the Frontend

In a separate terminal window, run:

```powershell
npm run dev:frontend
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `APP/frontend`: React application (CRA + Craco + Tailwind CSS).
- `APP/backend`: FastAPI server (Python + MongoDB).
- `package.json`: Root helper scripts for monorepo management.
