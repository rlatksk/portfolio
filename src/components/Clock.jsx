import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // WIB is UTC+7
  const wibTime = new Date(time.getTime() + 7 * 60 * 60 * 1000);
  const hours = String(wibTime.getUTCHours()).padStart(2, '0');
  const minutes = String(wibTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(wibTime.getUTCSeconds()).padStart(2, '0');

  return (
    <div className="text-xl font-bold tracking-wider" style={{ color: '#ffffff' }}>
      <span>{hours}:{minutes}:{seconds}</span>
    </div>
  );
};

export default Clock;