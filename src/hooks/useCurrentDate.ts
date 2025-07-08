
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getFormattedDate = () => {
    return dayjs(currentDate).format('ddd, MMM D, YYYY');
  };

  const getFormattedDateShort = () => {
    const day = currentDate.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    
    return `${day}, ${month} ${year}`;
  };

  return { currentDate, getFormattedDate, getFormattedDateShort };
};
