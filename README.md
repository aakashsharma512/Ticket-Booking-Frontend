# Ticket Booking System

A mini ticket booking system with React frontend and Node.js + Express backend.

## Features

- Create events with sections, rows, and seats
- View all available events
- Check seat availability by section and row
- Book tickets with validation
- Group discount for 4+ tickets
- Prevents overbooking

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend folder:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://aakisharma512_db_user:6U2WM5ApGF6b88O6@cluster0.d5cmrnm.mongodb.net/ticket_booking?retryWrites=true&w=majority
```

Note: MongoDB connection is already configured. Data will be stored in MongoDB Atlas.

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already created):
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### POST /events
Create a new event

### GET /events
Get all events

### GET /events/:id/availability
Get seat availability for an event

### POST /events/:id/purchase
Purchase tickets for an event

## Usage

1. Start both backend and frontend servers
2. Click "Create Event" button on the home page to create a new event
3. Fill in event details (name, date, sections, and rows with seat counts)
4. View events and click on any event to see details and book tickets
5. The system uses MongoDB Atlas for data storage (persistent data)

## Running Tests

To run unit tests for backend logic:

```bash
cd backend
npm test
```

## Project Structure

### Backend
- `server.js` - Main server file with Express setup
- `routes/eventRoutes.js` - Route definitions
- `controllers/eventController.js` - Business logic handlers
- `models/dataStore.js` - Data management and storage

### Frontend
- `src/App.jsx` - Main app component with routing
- `src/components/Home.jsx` - Home page with event list and creation form
- `src/components/EventDetail.jsx` - Event details page with booking form

