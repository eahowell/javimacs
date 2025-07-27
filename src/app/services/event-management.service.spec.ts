// src/app/services/event-management.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventManagementService } from './event-management.service';

describe('EventManagementService', () => {
  let service: EventManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EventManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
