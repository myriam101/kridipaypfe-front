import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsCornerComponent } from './clients-corner.component';

describe('ClientsCornerComponent', () => {
  let component: ClientsCornerComponent;
  let fixture: ComponentFixture<ClientsCornerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsCornerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
