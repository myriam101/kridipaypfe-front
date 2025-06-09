import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPointsComponent } from './gestion-points.component';

describe('GestionPointsComponent', () => {
  let component: GestionPointsComponent;
  let fixture: ComponentFixture<GestionPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
