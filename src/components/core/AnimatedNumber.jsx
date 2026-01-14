import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span className={`inline-block transition-all duration-300 transform ${isAnimating ? 'opacity-50 blur-[1px]' : 'opacity-100 blur-0'} ${className}`}>
      {displayValue}
    </span>
  );
};

export default AnimatedNumber;
