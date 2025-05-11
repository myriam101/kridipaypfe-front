import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimulationService } from 'src/app/services/simulation.service';

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

  constructor(
    public dialogRef: MatDialogRef<SimulateurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private simulateurService: SimulationService
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  
 
   submit() {
    const payload = {
      client_id: this.clientId = Number(localStorage.getItem('clientId')),
      product_id: this.data.product.id,
      duration_use: this.duration_use,
      nbr_use: this.nbr_use,
      periode_use: this.selectedPeriod
    };

    this.simulateurService.addSimulation(payload).subscribe({
      next: (res) => {
        console.log('Simulation réussie :', res);
        this.simulationResult = res;  // Stocke le résultat dans la variable
      },
      error: (err) => {
        console.error('Erreur simulation:', err);
      }
    });
  }

}
