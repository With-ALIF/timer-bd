
import { TimeRemaining } from './types';

export const calculateTimeRemaining = (targetDate: string): TimeRemaining => {
  const totalMs = new Date(targetDate).getTime() - new Date().getTime();
  
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, totalMs };
};

export const formatTimeNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const getStatusColor = (ms: number): string => {
  if (ms <= 0) return 'text-red-500';
  if (ms < 1000 * 60 * 60) return 'text-orange-500'; // Less than 1 hour
  if (ms < 1000 * 60 * 60 * 24) return 'text-blue-500'; // Less than 1 day
  return 'text-emerald-500';
};
