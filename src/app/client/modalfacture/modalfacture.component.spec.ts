import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalfactureComponent } from './modalfacture.component';

describe('ModalfactureComponent', () => {
  let component: ModalfactureComponent;
  let fixture: ComponentFixture<ModalfactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalfactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalfactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
