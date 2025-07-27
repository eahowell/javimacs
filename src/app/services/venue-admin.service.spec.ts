import { Venue } from './../interfaces/venue.interface';
import { TestBed } from '@angular/core/testing';

import { VenueAdminService } from './venue-admin.service';

describe('VenueAdminService', () => {
  let service: VenueAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenueAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
