import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnergybillService } from 'src/app/services/energybill.service';

@Component({
  selector: 'app-pdf-viewer-facture',
  templateUrl: './pdf-viewer-facture.component.html',
  styleUrls: ['./pdf-viewer-facture.component.css']
})
export class PdfViewerFactureComponent {
  pdfUrl?: string;
  isLoading = true;

  constructor(
    private energybillService: EnergybillService,
    public dialogRef: MatDialogRef<PdfViewerFactureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { billId: number }
  ) {
    this.loadPdf(data.billId);
  }

  loadPdf(billId: number) {
    this.energybillService.getPdfAsBase64(billId).subscribe({
      next: (res) => {
        const base64 = res.base64;
        const byteCharacters = atob(base64);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        this.pdfUrl = URL.createObjectURL(blob);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Erreur lors du chargement du PDF');
      }
    });
  }

  close() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
    this.dialogRef.close();
  }
}
