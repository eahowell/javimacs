// src/app/interfaces/event.interface.ts
export interface Event {
  id: string;
  venueId: string;  // References a Venue
  date: Date;
  startTime: string;
  endTime: string;
  details: string;
  isActive: boolean;
  createdDate: Date;
  // Optional: event-specific details
  expectedAttendance?: number;
  specialRequirements?: string;
}
