import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide HttpClientTestingModule instead of real HttpClient
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load events from JSON file', () => {
    const mockEvents = [
      {
        id: 'test-1',
        venueId: 'venue-1',
        date: '2025-01-30',
        startTime: '11:00 AM',
        endTime: '5:00 PM',
        details: 'Test event',
        isActive: true,
        createdDate: '2025-01-01T00:00:00.000Z',
      },
    ];

    // Subscribe to the service method
    service.getEvents().subscribe((events) => {
      expect(events).toEqual(jasmine.any(Array));
      expect(events.length).toBe(1);
      expect(events[0].id).toBe('test-1');
    });

    // Expect a request to the events.json file
    const req = httpMock.expectOne('assets/events.json');
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockEvents);
  });
});
