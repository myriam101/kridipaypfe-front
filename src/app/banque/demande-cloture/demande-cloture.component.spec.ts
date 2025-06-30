import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeClotureComponent } from './demande-cloture.component';

describe('DemandeClotureComponent', () => {
  let component: DemandeClotureComponent;
  let fixture: ComponentFixture<DemandeClotureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeClotureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeClotureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
