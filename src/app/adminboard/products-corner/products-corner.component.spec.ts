import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCornerComponent } from './products-corner.component';

describe('ProductsCornerComponent', () => {
  let component: ProductsCornerComponent;
  let fixture: ComponentFixture<ProductsCornerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsCornerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
