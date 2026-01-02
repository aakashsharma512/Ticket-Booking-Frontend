import React from 'react';

function AvailabilityOverview({ availability }) {
  return (
    <div className="availability-overview">
      <h3>Availability Overview</h3>
      {Object.keys(availability).map(sectionName => (
        <div key={sectionName} className="availability-section">
          <h4>{sectionName}</h4>
          {Object.keys(availability[sectionName]).map(rowName => {
            const rowData = availability[sectionName][rowName];
            return (
              <div key={rowName} className="row-info">
                <span>{rowName}</span>
                <div>
                  <span className="available">{rowData.available} available</span>
                  <span className="separator"> / </span>
                  <span className="booked">{rowData.booked} booked</span>
                  <span className="separator"> / </span>
                  <span>{rowData.total} total</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default AvailabilityOverview;

