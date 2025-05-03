import { TestBed } from '@angular/core/testing';

import { CarbonService } from './carbon.service';

describe('CarbonService', () => {
  let service: CarbonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
