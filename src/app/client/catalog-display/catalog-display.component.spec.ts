import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogDisplayComponent } from './catalog-display.component';

describe('CatalogDisplayComponent', () => {
  let component: CatalogDisplayComponent;
  let fixture: ComponentFixture<CatalogDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
