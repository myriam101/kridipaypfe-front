import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogsCornerComponent } from './catalogs-corner.component';

describe('CatalogsCornerComponent', () => {
  let component: CatalogsCornerComponent;
  let fixture: ComponentFixture<CatalogsCornerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogsCornerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogsCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
