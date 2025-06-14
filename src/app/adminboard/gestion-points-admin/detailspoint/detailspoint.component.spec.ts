import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailspointComponent } from './detailspoint.component';

describe('DetailspointComponent', () => {
  let component: DetailspointComponent;
  let fixture: ComponentFixture<DetailspointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailspointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailspointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
