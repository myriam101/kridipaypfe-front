import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPointsAdminComponent } from './gestion-points-admin.component';

describe('GestionPointsAdminComponent', () => {
  let component: GestionPointsAdminComponent;
  let fixture: ComponentFixture<GestionPointsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPointsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPointsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
