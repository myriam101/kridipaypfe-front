import { TestBed } from '@angular/core/testing';

import { SeuilBonifService } from './seuil-bonif.service';

describe('SeuilBonifService', () => {
  let service: SeuilBonifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeuilBonifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
