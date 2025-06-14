import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPointbonifComponent } from './detail-pointbonif.component';

describe('DetailPointbonifComponent', () => {
  let component: DetailPointbonifComponent;
  let fixture: ComponentFixture<DetailPointbonifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPointbonifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPointbonifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
