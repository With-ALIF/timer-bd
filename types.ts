
export interface CountdownEvent {
  id: string;
  title: string;
  time: string; // ISO string or parsable date string
  description?: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}