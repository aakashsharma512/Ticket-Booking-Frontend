import React from 'react';

function SeatMap({ seatDetails, selectedSeats, onSeatClick }) {
  const handleSeatClick = (seatNumber, isBooked, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!isBooked) {
      onSeatClick(seatNumber);
    }
  };

  return (
    <div className="seat-map">
      {seatDetails.map((seat) => {
        const seatNum = Number(seat.seatNumber);
        const isSelected = selectedSeats.some(s => Number(s) === seatNum);
        const seatClass = seat.isBooked 
          ? 'seat-booked' 
          : isSelected 
          ? 'seat-selected' 
          : 'seat-available';
        
        return (
          <button
            key={`seat-${seatNum}`}
            type="button"
            className={`seat ${seatClass}`}
            onClick={(e) => handleSeatClick(seatNum, seat.isBooked, e)}
            disabled={seat.isBooked}
            title={seat.isBooked ? 'Booked' : `Seat ${seatNum}`}
          >
            {seatNum}
          </button>
        );
      })}
    </div>
  );
}

export default SeatMap;
