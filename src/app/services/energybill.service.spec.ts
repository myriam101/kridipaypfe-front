import { TestBed } from '@angular/core/testing';

import { EnergybillService } from './energybill.service';

describe('EnergybillService', () => {
  let service: EnergybillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnergybillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
