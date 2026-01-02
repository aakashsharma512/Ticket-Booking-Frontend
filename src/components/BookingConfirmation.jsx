import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/events/bookings/${bookingId}`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setBooking(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="event-detail">
        <div className="message error">Booking not found</div>
        <button className="btn" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  const basePrice = 100;
  const discountedPrice = 80;
  const pricePerTicket = booking.groupDiscount ? discountedPrice : basePrice;
  const totalPrice = booking.quantity * pricePerTicket;
  const eventId = typeof booking.eventId === 'object' && booking.eventId?._id 
    ? booking.eventId._id.toString() 
    : String(booking.eventId || '');

  return (
    <div className="event-detail">
      <div className="booking-confirmation">
        <div className="confirmation-header">
          <h1>✓ Booking Confirmed!</h1>
          <p className="confirmation-subtitle">Thank you for your booking</p>
        </div>

        <div className="confirmation-details-compact">
          <div className="detail-card-compact">
            <div className="detail-row">
              <span className="detail-label">Event:</span>
              <span className="detail-value">{booking.eventName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Section:</span>
              <span className="detail-value">{booking.section} - {booking.row}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tickets:</span>
              <span className="detail-value">{booking.quantity}</span>
            </div>
            {booking.groupDiscount && (
              <div className="detail-row discount-badge-inline">
                <span className="detail-label">Group Discount:</span>
                <span className="detail-value">Applied</span>
              </div>
            )}
            <div className="detail-row total-price-compact">
              <span className="detail-label">Total:</span>
              <span className="detail-value">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Events
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/event/${eventId}`)}>
            View Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
