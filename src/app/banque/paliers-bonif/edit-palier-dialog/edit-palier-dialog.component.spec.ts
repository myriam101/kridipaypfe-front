import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPalierDialogComponent } from './edit-palier-dialog.component';

describe('EditPalierDialogComponent', () => {
  let component: EditPalierDialogComponent;
  let fixture: ComponentFixture<EditPalierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPalierDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPalierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
