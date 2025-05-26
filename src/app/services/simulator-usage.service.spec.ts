import { TestBed } from '@angular/core/testing';

import { SimulatorUsageService } from './simulator-usage.service';

describe('SimulatorUsageService', () => {
  let service: SimulatorUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatorUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
