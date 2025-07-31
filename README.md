# Conntour Space Explorer

A web application that allows users to explore and search NASA images with natural language queries. Built with Node.js backend and React frontend.

## Features

- **Browse Images**: View all NASA images with metadata
- **Natural Language Search**: Search images using free-text queries (e.g., "images of Mars rovers", "solar flares")
- **Search History**: Keep track of previous searches with the ability to delete individual entries
- **Confidence Scoring**: Results are ranked with confidence scores based on keyword matching
- **Responsive Design**: Modern UI built with React, TypeScript

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS + SCSS
- **Data**: JSON file storage for search history and mock data

## Prerequisites

- Node.js 14+ 
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd conntour-space-explorer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Start the development server:
```bash
npm run dev
```

The backend will run on http://localhost:8001

### 3. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

- `GET /api/sources` - Get all images or search with query parameter `q`
- `POST /api/insert-search-history` - Save search query to history
- `GET /api/search-history` - Retrieve search history
- `DELETE /api/search-history/:id` - Delete specific search from history

## Project Structure
```
connto
├── backend/           # FastAPI backend
│   ├── app.py        # Main FastAPI application
│   └── data/         # Mock data
├── frontend/         # React frontend
│   ├── src/         # Source files
│   └── public/      # Static files
└── README.md        # This file
```