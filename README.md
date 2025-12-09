# Jerzey LAB E-commerce Website

A modern e-commerce website built with React and Node.js for Jerzey LAB athletic wear.

## Features

- Modern, dark-themed UI
- Responsive navigation bar
- Homepage with brand logo
- Social media integration
- Search functionality
- User authentication ready

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **Styling**: CSS3

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Start development servers (frontend + backend):
```bash
npm run dev
```

This will start:
- Frontend server on http://localhost:3000
- Backend server on http://localhost:5000

### Individual Commands

- Start frontend only: `npm run client`
- Start backend only: `npm run server`

## Project Structure

```
NBA/
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── assets/       # Static assets
│   └── package.json
├── server/           # Node.js backend
│   ├── server.js
│   └── package.json
└── assets/           # Shared assets (images, etc.)
```

## Development

The project uses:
- Vite for fast frontend development
- Express for backend API
- Concurrently to run both servers simultaneously

## License

ISC

