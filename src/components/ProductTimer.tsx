import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const ProductTimer: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 237,
    hours: 9,
    minutes: 18,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Eye className="w-5 h-5 text-gray-600" />
        <span className="text-gray-600">
          {timeRemaining.days}d : {timeRemaining.hours.toString().padStart(2, '0')}:
          {timeRemaining.minutes.toString().padStart(2, '0')}:
          {timeRemaining.seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        ALD Uniform Hoodie
      </div>
      <div className="text-lg font-semibold">
        $69.00
      </div>
    </div>
  );
};

export default ProductTimer;