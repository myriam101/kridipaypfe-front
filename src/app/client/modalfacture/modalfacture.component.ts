import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimulationService } from 'src/app/services/simulation.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modalfacture',
  templateUrl: './modalfacture.component.html',
  styleUrls: ['./modalfacture.component.css']
})
export class ModalfactureComponent implements OnInit {
  selectedPeriod: string = '';
  clientId: number = 0;
  facture: any[] = []; 
simulations :any;
successMessage: string | null = null;

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
    this.dialogRef.close();
  }

  valider(): void {
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

  this.simulationService.envoyerSimulations(payload).subscribe({
    next: (response: any) => {
      console.log('Réponse backend simulation :', response);

      // Utilisation de 'results' au lieu de 'simulations'
      const simulationIds = response.results.map((sim: any) => sim.simulation_id);

      this.energybillService.calculerFactures(simulationIds).subscribe({
        next: (factures: any) => {
          console.log('Factures estimées :', factures);
this.successMessage = "Votre estimation de facture énergétique est prête à être téléchargée depuis votre profil.";

setTimeout(() => {
  this.dialogRef.close(factures); // Tu peux ajouter un délai pour laisser le temps de lire le message
}, 3000);
        },
        error: (error) => {
          console.error('Erreur calcul facture :', error);
        }
      });
    },
    error: (error) => {
      console.error('Erreur simulation :', error);
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
allerAuProfil() {
    this.dialogRef.close(); 
    this.router.navigate(['/client/profile']); 
  }
}
