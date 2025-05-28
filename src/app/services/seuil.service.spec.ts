import { TestBed } from '@angular/core/testing';

import { SeuilService } from './seuil.service';

describe('SeuilService', () => {
  let service: SeuilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeuilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
