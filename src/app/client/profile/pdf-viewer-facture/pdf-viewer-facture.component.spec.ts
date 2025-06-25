import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerFactureComponent } from './pdf-viewer-facture.component';

describe('PdfViewerFactureComponent', () => {
  let component: PdfViewerFactureComponent;
  let fixture: ComponentFixture<PdfViewerFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewerFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfViewerFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
