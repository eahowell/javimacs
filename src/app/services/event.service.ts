import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor() {}
  private transformEventData(rawData: any[]): Event[] {
    return rawData.map((item) => ({
      ...item,
      date: new Date(item.date),
      createdDate: new Date(item.createdDate),
    }));
  }
}
