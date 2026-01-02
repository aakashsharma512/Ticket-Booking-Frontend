import React from 'react';

function SectionRowSelector({ 
  availability, 
  selectedSection, 
  selectedRow, 
  onSectionChange, 
  onRowChange 
}) {
  const getAvailableRows = () => {
    if (!selectedSection || !availability[selectedSection]) {
      return [];
    }
    return Object.keys(availability[selectedSection]);
  };

  const handleSectionChange = (e) => {
    const section = e.target.value;
    const rows = Object.keys(availability[section] || {});
    onSectionChange(section);
    if (rows.length > 0) {
      onRowChange(rows[0]);
    } else {
      onRowChange('');
    }
  };

  return (
    <div className="section-selector">
      <div className="form-group">
        <label>Section</label>
        <select 
          value={selectedSection} 
          onChange={handleSectionChange}
          required
        >
          <option value="">Select Section</option>
          {Object.keys(availability).map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Row</label>
        <select 
          value={selectedRow} 
          onChange={(e) => onRowChange(e.target.value)}
          required
        >
          <option value="">Select Row</option>
          {getAvailableRows().map(row => {
            const rowData = availability[selectedSection][row];
            return (
              <option key={row} value={row}>
                {row} ({rowData.available} available)
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default SectionRowSelector;

