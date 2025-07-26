// src/app/interfaces/venue.interface.ts
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
  createdDate: Date;
  // Optional: operational details
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}
