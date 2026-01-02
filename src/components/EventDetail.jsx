import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SectionRowSelector from './SectionRowSelector';
import SeatMap from './SeatMap';
import SelectedSeatsInfo from './SelectedSeatsInfo';
import AvailabilityOverview from './AvailabilityOverview';
import Message from './Message';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EventDetail() {
  const { id: idParam } = useParams();
  const navigate = useNavigate();
  
  const id = idParam ? String(idParam) : '';

  const [event, setEvent] = useState(null);
  const [availability, setAvailability] = useState({});
  const [seatDetails, setSeatDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState(null);
  const [groupDiscount, setGroupDiscount] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const result = await response.json();
      
      if (result.status && result.data) {
        const eventData = result.data.find(e => e.id === id || e.id.toString() === id);
        setEvent(eventData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  }, [id]);

  const fetchAvailability = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`${API_URL}/events/${id}/availability`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setAvailability(result.data);
        
        if (!selectedSection && Object.keys(result.data).length > 0) {
          const firstSection = Object.keys(result.data)[0];
          setSelectedSection(firstSection);
          if (result.data[firstSection] && Object.keys(result.data[firstSection]).length > 0) {
            setSelectedRow(Object.keys(result.data[firstSection])[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  }, [id, selectedSection]);

  const fetchSeatDetails = useCallback(async () => {
    if (!id || !selectedSection || !selectedRow) return;
    try {
      const response = await fetch(`${API_URL}/events/${id}/seats?section=${selectedSection}&row=${selectedRow}`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setSeatDetails(result.data);
        setSelectedSeats([]);
      }
    } catch (error) {
      console.error('Error fetching seat details:', error);
    }
  }, [id, selectedSection, selectedRow]);

  useEffect(() => {
    if (!id) return;
    fetchEventDetails();
    fetchAvailability();
  }, [id, fetchEventDetails, fetchAvailability]);

  useEffect(() => {
    if (!id) return;
    if (selectedSection && selectedRow) {
      fetchSeatDetails();
    } else {
      setSeatDetails([]);
      setSelectedSeats([]);
    }
  }, [selectedSection, selectedRow, id, fetchSeatDetails]);

  const handleSeatClick = (seatNumber) => {
    const seatNum = Number(seatNumber);
    setSelectedSeats(prev => {
      const exists = prev.some(s => Number(s) === seatNum);
      if (exists) {
        return prev.filter(s => Number(s) !== seatNum);
      } else {
        return [...prev, seatNum];
      }
    });
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setMessage(null);
    setGroupDiscount(false);

    if (!selectedSection || !selectedRow) {
      setMessage({ type: 'error', text: 'Please select section and row' });
      return;
    }

    if (selectedSeats.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one seat' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/events/${id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: selectedSection,
          row: selectedRow,
          quantity: selectedSeats.length
        })
      });

      const result = await response.json();

      if (result.status && result.data) {
        toast.success(result.message || 'Tickets booked successfully!');
        fetchAvailability();
        fetchSeatDetails();
        setSelectedSeats([]);
        navigate(`/booking/${result.data.bookingId}`);
      } else {
        toast.error(result.message || 'Booking failed');
        setMessage({ type: 'error', text: result.message || 'Booking failed' });
        fetchSeatDetails();
      }
    } catch (error) {
      toast.error('Failed to process booking');
      setMessage({ type: 'error', text: 'Failed to process booking' });
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (!event) {
    return <div className="loading">Event not found</div>;
  }

  return (
    <div className="event-detail">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Events
      </button>

      <div className="event-header">
        <h1>{event.name}</h1>
        <h2>Date: {new Date(event.date).toLocaleString()}</h2>
      </div>

      <div className="seat-booking-container">
        <div className="availability-summary">
          <h2>Select Your Seats</h2>
          
          <SectionRowSelector
            availability={availability}
            selectedSection={selectedSection}
            selectedRow={selectedRow}
            onSectionChange={setSelectedSection}
            onRowChange={setSelectedRow}
          />

          {selectedSection && selectedRow && (
            <div className="seat-map-container">
              <div className="seat-map-header">
                <h3>{selectedSection} - {selectedRow}</h3>
                <div className="seat-legend">
                  <div className="legend-item">
                    <div className="seat-available-legend"></div>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat-selected-legend"></div>
                    <span>Selected ({selectedSeats.length})</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat-booked-legend"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              {seatDetails.length > 0 && (
                <SeatMap
                  seatDetails={seatDetails}
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                />
              )}

              <SelectedSeatsInfo selectedSeats={selectedSeats} />

              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handlePurchase}
                disabled={selectedSeats.length === 0}
                style={{ marginTop: '20px', width: '100%' }}
              >
                Book {selectedSeats.length > 0 ? `${selectedSeats.length} ` : ''}Ticket{selectedSeats.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>

        <AvailabilityOverview availability={availability} />
      </div>

      <Message message={message} groupDiscount={groupDiscount} />
    </div>
  );
}

export default EventDetail;
