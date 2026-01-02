import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import EventCard from './EventCard';
import CreateEventForm from './CreateEventForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    sections: [{ name: '', rows: [{ name: '', totalSeats: '' }] }]
  });
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setEvents(result.data);
      } else {
        setEvents([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex][field] = value;
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleRowChange = (sectionIndex, rowIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].rows[rowIndex][field] = field === 'totalSeats' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { name: '', rows: [{ name: '', totalSeats: '' }] }]
    }));
  };

  const removeSection = (index) => {
    if (formData.sections.length > 1) {
      const updatedSections = formData.sections.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sections: updatedSections }));
    }
  };

  const addRow = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].rows.push({ name: '', totalSeats: '' });
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const removeRow = (sectionIndex, rowIndex) => {
    const updatedSections = [...formData.sections];
    if (updatedSections[sectionIndex].rows.length > 1) {
      updatedSections[sectionIndex].rows = updatedSections[sectionIndex].rows.filter((_, i) => i !== rowIndex);
      setFormData(prev => ({ ...prev, sections: updatedSections }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name || !formData.date) {
      setMessage({ type: 'error', text: 'Please fill event name and date' });
      return;
    }

    const sections = formData.sections.map(section => ({
      name: section.name,
      rows: section.rows.map(row => ({
        name: row.name,
        totalSeats: parseInt(row.totalSeats) || 0
      })).filter(row => row.name && row.totalSeats > 0)
    })).filter(section => section.name && section.rows.length > 0);

    if (sections.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one section with rows' });
      return;
    }

    try {
      const dateISO = new Date(formData.date).toISOString();
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          date: dateISO,
          sections: sections
        })
      });

      const result = await response.json();

      if (result.status) {
        toast.success(result.message || 'Event created successfully!');
        setMessage({ type: 'success', text: result.message || 'Event created successfully!' });
        setFormData({
          name: '',
          date: '',
          sections: [{ name: '', rows: [{ name: '', totalSeats: '' }] }]
        });
        setShowCreateForm(false);
        fetchEvents();
      } else {
        toast.error(result.message || 'Failed to create event');
        setMessage({ type: 'error', text: result.message || 'Failed to create event' });
      }
    } catch (error) {
      toast.error('Failed to create event');
      setMessage({ type: 'error', text: 'Failed to create event' });
    }
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Available Events</h2>
        <button className="btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {showCreateForm && (
        <CreateEventForm
          formData={formData}
          message={message}
          onInputChange={handleInputChange}
          onSectionChange={handleSectionChange}
          onRowChange={handleRowChange}
          onAddSection={addSection}
          onRemoveSection={removeSection}
          onAddRow={addRow}
          onRemoveRow={removeRow}
          onSubmit={handleSubmit}
        />
      )}

      {events.length === 0 ? (
        <div className="event-card">
          <p>No events available at the moment.</p>
        </div>
      ) : (
        events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onClick={handleEventClick}
          />
        ))
      )}
    </div>
  );
}

export default Home;
