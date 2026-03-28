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

  // Format date: e.g., "Sat, 28 Mar"
  const dayAbbrev = wibTime.toLocaleDateString('en-US', { weekday: 'short' });
  const day = String(wibTime.getUTCDate()).padStart(2, '0');
  const monthAbbrev = wibTime.toLocaleDateString('en-US', { month: 'short' });
  const dateStr = `${dayAbbrev}, ${day} ${monthAbbrev}`;

  return (
    <div className="flex flex-col" style={{ color: '#a0a0a0' }}>
      <span className="text-sm font-bold tracking-wider mb-1">{dateStr}</span>
      <span className="text-xl font-bold tracking-wider">{hours}:{minutes}:{seconds}</span>
    </div>
  );
};

export default Clock;