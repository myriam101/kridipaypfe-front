import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPalierDialogComponent } from './add-palier-dialog.component';

describe('AddPalierDialogComponent', () => {
  let component: AddPalierDialogComponent;
  let fixture: ComponentFixture<AddPalierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPalierDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPalierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
