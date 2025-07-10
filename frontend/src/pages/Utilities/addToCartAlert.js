import React, { useState, useEffect } from 'react';

function TimeoutAlert({ message, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [duration]);

  return isVisible ? (
    
      {message}
    
  ) : null;
}

function addToCartAlert() {
  return (
    
      <TimeoutAlert message="Items were added to cart" />
     );
}

export default addToCartAlert;