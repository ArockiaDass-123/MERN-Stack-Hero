# EventHub - Event Management Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for discovering and managing event registrations.

## Features

- **User Authentication**: JWT-based signup and login
- **Event Discovery**: Browse, search, and filter events by category and location
- **Event Registration**: Register for events with capacity management
- **User Dashboard**: View upcoming and past registered events
- **Responsive Design**: Premium UI with Tailwind CSS and Framer Motion animations

## Quick Start (Run Manually)

To run the application, you need to open **two separate terminal windows**.

**Terminal 1: Backend**
```bash
cd MERN-Stack-Hero1/MERN-Stack-Hero/server
npm install  # Only needed once
npm run dev
```
*Server will start on http://localhost:5000*

**Terminal 2: Frontend**
```bash
cd MERN-Stack-Hero1/MERN-Stack-Hero/client
npm install  # Only needed once
npm run dev
```
*Client will start on http://localhost:3000*

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 19 with Vite
- Wouter for routing
- Axios for API calls
- Tailwind CSS for styling
- Radix UI components
- Framer Motion for animations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd MERN-Stack-Hero1/MERN-Stack-Hero
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   
   Create/edit `server/.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Seed the Database**
   ```bash
   npm run seed
   ```

5. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend** (from `server` directory):
   ```bash
   npm run dev
   ```

2. **Start the Frontend** (from `client` directory):
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (with optional filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event (protected)
- `DELETE /api/events/:id/register` - Cancel registration (protected)
- `GET /api/events/user/mine` - Get user's registered events (protected)

## Project Structure

```
MERN-Stack-Hero/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── scripts/         # Database seeding
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── lib/         # Utilities
│   │   └── index.css    # Global styles
│   └── package.json
└── README.md
```

## Deployment

### Backend (Render/Railway)
1. Create a new web service
2. Connect your repository
3. Set environment variables (MONGODB_URI, JWT_SECRET)
4. Deploy

### Frontend (Vercel/Netlify)
1. Create a new project
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Update API base URL to point to deployed backend
5. Deploy

## Default Credentials

After seeding, you can use:
- Username: `organizer`
- Password: `password123`

## License

ISC
