import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonifGamComponent } from './bonif-gam.component';

describe('BonifGamComponent', () => {
  let component: BonifGamComponent;
  let fixture: ComponentFixture<BonifGamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonifGamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonifGamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
