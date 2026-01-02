import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`),
        fetch(`${API_URL}/admin/bookings`),
        fetch(`${API_URL}/events`)
      ]);

      const statsResult = await statsRes.json();
      if (statsResult.status && statsResult.data) {
        setStats(statsResult.data);
      }

      const bookingsResult = await bookingsRes.json();
      if (bookingsResult.status && bookingsResult.data) {
        setBookings(bookingsResult.data);
      }

      const eventsResult = await eventsRes.json();
      if (eventsResult.status && eventsResult.data) {
        setEvents(eventsResult.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const getEventName = (eventId) => {
    const event = events.find(e => e.id === eventId || e.id.toString() === eventId);
    return event ? event.name : `Event #${eventId}`;
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="event-detail">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Home
      </button>

      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        {stats && (
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Total Tickets</h3>
              <p className="stat-value">{stats.totalTickets}</p>
            </div>
            <div className="stat-card revenue-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.revenue}</p>
            </div>
          </div>
        )}

        <div className="bookings-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <div className="message">
              No bookings yet
            </div>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Event</th>
                    <th>Section</th>
                    <th>Row</th>
                    <th>Tickets</th>
                    <th>Discount</th>
                    <th>Revenue</th>
                    <th>Booking Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const basePrice = 100;
                    const discountedPrice = 80;
                    const pricePerTicket = booking.groupDiscount ? discountedPrice : basePrice;
                    const revenue = booking.quantity * pricePerTicket;

                    return (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{getEventName(booking.eventId)}</td>
                        <td>{booking.section}</td>
                        <td>{booking.row}</td>
                        <td>{booking.quantity}</td>
                        <td>{booking.groupDiscount ? 'Yes (20%)' : 'No'}</td>
                        <td>₹{revenue}</td>
                        <td>{new Date(booking.bookedAt || booking.createdAt).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {stats && stats.bookingsByEvent && Object.keys(stats.bookingsByEvent).length > 0 && (
          <div className="event-stats-section">
            <h2>Bookings by Event</h2>
            <div className="event-stats">
              {Object.entries(stats.bookingsByEvent).map(([eventId, ticketCount]) => (
                <div key={eventId} className="event-stat-card">
                  <h4>{getEventName(eventId)}</h4>
                  <p>{ticketCount} tickets sold</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
