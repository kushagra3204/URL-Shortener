import React, { useEffect } from 'react';

const Notification = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timeoutId = setTimeout(() => {
        onHide();
      }, 2000); // Adjust the time as needed (in milliseconds)

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isVisible, onHide]);

  return (
    <div style={{ display: isVisible ? 'block' : 'none', position: 'fixed', bottom: 10, right: 10, padding: 10, background: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>
      {message}
    </div>
  );
};

export default Notification;