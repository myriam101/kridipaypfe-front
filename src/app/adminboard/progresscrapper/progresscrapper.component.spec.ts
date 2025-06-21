import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresscrapperComponent } from './progresscrapper.component';

describe('ProgresscrapperComponent', () => {
  let component: ProgresscrapperComponent;
  let fixture: ComponentFixture<ProgresscrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgresscrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresscrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
