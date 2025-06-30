import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaliersBonifComponent } from './paliers-bonif.component';

describe('PaliersBonifComponent', () => {
  let component: PaliersBonifComponent;
  let fixture: ComponentFixture<PaliersBonifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaliersBonifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaliersBonifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
