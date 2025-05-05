import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCornerComponent } from './home-corner.component';

describe('HomeCornerComponent', () => {
  let component: HomeCornerComponent;
  let fixture: ComponentFixture<HomeCornerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCornerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
