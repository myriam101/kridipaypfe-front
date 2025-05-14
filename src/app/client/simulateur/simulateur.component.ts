import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimulationService } from 'src/app/services/simulation.service';
import { EnergybillService } from 'src/app/services/energybill.service';


@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.component.html',
  styleUrls: ['./simulateur.component.css']
})
export class SimulateurComponent {
  nbr_use: number = 1;
  duration_use: number = 0;
  clientId: number | null = null; 
selectedPeriod: string |null=null; 
  simulationResult: any = null;  
  facture: any;
  simulationId: number=0; 
  result: any;

  constructor(
    public dialogRef: MatDialogRef<SimulateurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private simulateurService: SimulationService,private energyBillService: EnergybillService
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  submit() {
  const payload = {
    client_id: Number(localStorage.getItem('clientId')),
    product_id: this.data.product.id,
    duration_use: this.duration_use,
    nbr_use: this.nbr_use,
    periode_use: this.selectedPeriod
  };

  this.simulateurService.addSimulation(payload).subscribe({
    next: (res) => {
      console.log('Simulation réussie :', res);
      this.simulationResult = res;
      const simId = res.id || res.simulation_id; 

      // Affiche un message temporaire
      this.facture = {
        electricite: 'Calcul en cours...',
        eau: 'Calcul en cours...',
        montant_total: 'Calcul en cours...'
      };

      // 1. Calculer la facture
      this.energyBillService.calculateEnergyBill(simId).subscribe({
        next: (response) => {
          console.log('Facture calculée :', response);

          // 2. Récupérer la facture réelle
          this.energyBillService.getBillBySimulationId(simId).subscribe({
            next: (data) => {
              this.facture = data;
              console.log("Facture récupérée :", this.facture);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération de la facture :', err);
              this.facture = null;
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors du calcul de la facture :', error);
          this.facture = null;
        }
      });
    },
    error: (err) => {
      console.error('Erreur simulation:', err);
    }
  });
}


  // Méthode pour calculer la facture
  calculateBill() {
    this.energyBillService.calculateEnergyBill(this.simulationId).subscribe(
      (response) => {
        this.result = response;
        console.log('Facture calculée:', this.result);
      },
      (error) => {
        console.error('Erreur lors du calcul de la facture', error);
      }
    );
  }
getFacture(simulationId: number) {
  this.energyBillService.getBillBySimulationId(simulationId).subscribe({
    next: (data) => {
      this.facture = data;
      console.log("Facture récupérée :", this.facture);
    },
    error: (err) => {
      console.error('Pas de facture', err);
      this.facture = null;
    }
  });
}

}
