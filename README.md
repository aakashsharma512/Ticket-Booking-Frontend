# Frontend - Ticket Booking System

React frontend for ticket booking system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in frontend folder:
```
REACT_APP_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm start
```

App opens at `http://localhost:3000`

## Features

- Home page with event list and create event form
- Event detail page with visual seat selection
- Booking confirmation page
- Admin dashboard for bookings and statistics

## Project Structure

- `src/App.jsx` - Main app component with routing
- `src/components/` - React components
  - `Home.jsx` - Home page
  - `EventDetail.jsx` - Event details and seat booking
  - `BookingConfirmation.jsx` - Booking confirmation page
  - `AdminDashboard.jsx` - Admin dashboard
  - Other supporting components

## Usage

1. Start backend server first (port 5000)
2. Start frontend server (port 3000)
3. Create events from home page
4. View events and book tickets
5. Access admin dashboard at `/admin`
