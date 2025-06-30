import { TestBed } from '@angular/core/testing';

import { BonifPalierBanqueService } from './bonif-palier-banque.service';

describe('BonifPalierBanqueService', () => {
  let service: BonifPalierBanqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonifPalierBanqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
