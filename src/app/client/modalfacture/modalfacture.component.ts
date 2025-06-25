import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimulationService } from 'src/app/services/simulation.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-modalfacture',
  templateUrl: './modalfacture.component.html',
  styleUrls: ['./modalfacture.component.css']
})
export class ModalfactureComponent implements OnInit {
  isLoading: boolean = false;
  selectedPeriod: string = '';
  clientId: number = 0;
  facture: any[] = []; 
  simulations: any;
  successMessage: string | null = null;
  pdfUrl: string | undefined;
downloaded: boolean = false;

  constructor(
    private simulationService: SimulationService,
    private energybillService: EnergybillService,
    public dialogRef: MatDialogRef<ModalfactureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { products: any[] },
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.clientId = Number(localStorage.getItem('clientId'));
  }

 close() {
  if (this.pdfUrl) {
    URL.revokeObjectURL(this.pdfUrl);
    this.pdfUrl = undefined;
  }
  this.dialogRef.close();
}


  valider(): void {
    this.isLoading = true;
    const periode = this.selectedPeriod;
    const clientId = this.clientId;

    const simulations = this.data.products.map((prod: any) => ({
      product_id: prod.product_id,
      nbr_use: prod.nbr_use || 0,
      duration_use: prod.duration_use || 0
    }));

    const payload = {
      client_id: clientId,
      periode_use: periode,
      simulations: simulations
    };

    console.log('Payload envoyé :', payload);

    this.simulationService.envoyerSimulations(payload).pipe(
      switchMap((response: any) => {
        console.log('Réponse backend simulation :', response);
        const simulationIds = response.results.map((sim: any) => sim.simulation_id);
        return this.energybillService.calculerFactures(simulationIds);
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Réponse backend facture :', response);
      this.isLoading = false; 

        if (response.id) {
          this.successMessage = "Votre estimation de facture énergétique est prête à être téléchargée.";
            this.loadPdf(response.id);

        } else {
          console.warn("Aucun ID de GlobalEnergyBill reçu. Le traitement est-il fini ?");
        }
      },
      error: (error) => {
              this.isLoading = false; 
        console.error('Erreur calcul facture :', error);
        
      }
    });
  }

  isFormValid(): boolean {
    if (!this.selectedPeriod) return false;

    for (let product of this.data.products) {
      if (
        product.nbr_use == null || product.nbr_use < 0 ||
        product.duration_use == null || product.duration_use < 0
      ) {
        return false;
      }
    }

    return true;
  }

downloadPdf() {
  this.clientId = Number(localStorage.getItem('clientId'));
  this.downloaded = true;

  this.energybillService.downloadEnergyEstimationPdf(this.clientId).subscribe(blob => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'estimation-facture.pdf';
    link.click();

    // supprimer les données côté backend après téléchargement
    this.energybillService.cleanupEnergyEstimation(this.clientId).subscribe({
      next: () => console.log('Données supprimées après export'),
      error: err => console.error('Erreur suppression après export', err)
    });
  });
}
loadPdf(billId: number) {
  this.energybillService.getPdfAsBase64(billId).subscribe(res => {
    const base64 = res.base64;
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    this.pdfUrl = URL.createObjectURL(blob);
  });
}

resetFacture() {
  this.successMessage = null;
  if (this.pdfUrl) {
    URL.revokeObjectURL(this.pdfUrl);
    this.pdfUrl = undefined;
  }
}


}
