import React from 'react';

function SelectedSeatsInfo({ selectedSeats }) {
  if (selectedSeats.length === 0) {
    return null;
  }

  const sortedSeats = [...selectedSeats].map(s => Number(s)).sort((a, b) => a - b);

  return (
    <div className="selected-seats-info">
      <p>Selected Seats: {sortedSeats.join(', ')}</p>
      <p>Total Tickets: {selectedSeats.length}</p>
      {selectedSeats.length >= 4 && (
        <p className="discount-info">Group Discount Applied! 🎉</p>
      )}
    </div>
  );
}

export default SelectedSeatsInfo;

