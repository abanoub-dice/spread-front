import { useEffect, useState, useMemo } from 'react';
import dayjs from '~/utils/date/dayjs';

interface CountdownTimerProps {
  eventStartDate: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
}

const calculateTimeLeft = (eventStartDate: string): TimeLeft => {
  const now = dayjs();
  const target = dayjs(eventStartDate);
  if (now.isAfter(target)) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  const diff = target.diff(now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, expired: false };
};

const CountdownTimer = ({ eventStartDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!eventStartDate) return;

    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft(eventStartDate));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [eventStartDate]);

  const display = useMemo(() => {
    if (!timeLeft) return '';
    if (timeLeft.expired) return 'Event Expired';
    const { days, hours, minutes } = timeLeft;
    if (days === 0 && hours === 0) {
      return `${minutes} mins until event`;
    } else if (days === 0) {
      return `${hours} hours, ${minutes} mins until event`;
    } else {
      return `${days} days, ${hours} hours, ${minutes} mins until event`;
    }
  }, [timeLeft]);

  return <>{display}</>;
};

export default CountdownTimer; 