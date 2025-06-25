import { TestBed } from '@angular/core/testing';

import { LocationiqService } from './locationiq.service';

describe('LocationiqService', () => {
  let service: LocationiqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationiqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
