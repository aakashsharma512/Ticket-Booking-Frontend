import React from 'react';

function Message({ message, groupDiscount }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`message ${message.type}`} style={{ marginTop: '20px' }}>
      {message.text}
      {groupDiscount && (
        <span className="discount-badge">Group Discount Applied!</span>
      )}
    </div>
  );
}

export default Message;

