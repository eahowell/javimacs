import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { VenueService } from './venue.service';

describe('VenueService', () => {
  let service: VenueService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VenueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load venues from JSON file', () => {
    const mockVenues = [
      {
        id: 'venue-1',
        name: 'Test Venue',
        address: '123 Test St',
        city: 'Test City',
        state: 'FL',
        zip: '12345',
        isActive: true,
        createdDate: '2025-01-01T00:00:00.000Z',
      },
    ];

    service.getVenues().subscribe((venues) => {
      expect(venues).toEqual(jasmine.any(Array));
      expect(venues.length).toBe(1);
      expect(venues[0].name).toBe('Test Venue');
    });

    const req = httpMock.expectOne('assets/venues.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockVenues);
  });
});
