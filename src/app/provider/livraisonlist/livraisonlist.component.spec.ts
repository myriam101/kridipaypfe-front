import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonlistComponent } from './livraisonlist.component';

describe('LivraisonlistComponent', () => {
  let component: LivraisonlistComponent;
  let fixture: ComponentFixture<LivraisonlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivraisonlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivraisonlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
