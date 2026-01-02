import React from 'react';
import Message from './Message';

function CreateEventForm({ formData, message, onInputChange, onSectionChange, onRowChange, onAddSection, onRemoveSection, onAddRow, onRemoveRow, onSubmit }) {
  return (
    <div className="create-event-form">
      <h3>Create New Event</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            placeholder="e.g., Concert XYZ"
          />
        </div>

        <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="sections-container">
          <h4>Sections</h4>
          {formData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section-item">
              <div className="section-header">
                <label>Section {sectionIndex + 1}</label>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-small" 
                  onClick={() => onRemoveSection(sectionIndex)}
                >
                  Remove Section
                </button>
              </div>
              
              <div className="form-group">
                <label>Section Name</label>
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) => onSectionChange(sectionIndex, 'name', e.target.value)}
                  placeholder="e.g., Section A"
                  required
                />
              </div>

              <div className="rows-container">
                <label className="rows-label">Rows</label>
                {section.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="row-input-group">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => onRowChange(sectionIndex, rowIndex, 'name', e.target.value)}
                      placeholder="Row name"
                      className="row-input"
                      required
                    />
                    <input
                      type="number"
                      value={row.totalSeats}
                      onChange={(e) => onRowChange(sectionIndex, rowIndex, 'totalSeats', e.target.value)}
                      placeholder="Seats"
                      min="1"
                      className="seats-input"
                      required
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-small"
                      onClick={() => onRemoveRow(sectionIndex, rowIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-secondary btn-small"
                  onClick={() => onAddRow(sectionIndex)}
                >
                  + Add Row
                </button>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onAddSection}
          >
            + Add Section
          </button>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Event
        </button>
      </form>

      <Message message={message} />
    </div>
  );
}

export default CreateEventForm;
