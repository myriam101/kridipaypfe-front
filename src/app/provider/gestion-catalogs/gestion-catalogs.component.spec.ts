import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCatalogsComponent } from './gestion-catalogs.component';

describe('GestionCatalogsComponent', () => {
  let component: GestionCatalogsComponent;
  let fixture: ComponentFixture<GestionCatalogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCatalogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
