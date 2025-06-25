import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SimulationService } from 'src/app/services/simulation.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { SimulatorUsageService } from 'src/app/services/simulator-usage.service';
import { CarbonService } from 'src/app/services/carbon.service';


@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.component.html',
  styleUrls: ['./simulateur.component.css']
})
export class SimulateurComponent implements OnInit{
    @Output() simulationCompleted = new EventEmitter<number>(); 

  nbr_use: number = 1;
  duration_use: number = 0;
  clientId: number | null = null; 
  selectedPeriod: string |null=null; 
  simulationResult: any = null;  
  facture: any;
  simulationId: number=0; 
  result: any;
  showInfoTooltip = false;
  tooltipPosition = { top: 0, left: 0 };
  impactCarbone: number | null = null;  
  showResultsOnly: boolean = false;
isLoading = false;

  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;
  
  constructor(private carbonService:CarbonService,private simulationService: SimulatorUsageService, public dialogRef: MatDialogRef<SimulateurComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private simulateurService: SimulationService,private energyBillService: EnergybillService) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.setTooltipPosition();
      this.showInfoTooltip = true;
    }, 300); 
      }

      isFormValid(): boolean {
  return this.selectedPeriod !== null && this.duration_use > 0 && this.nbr_use > 0;
}

setTooltipPosition() {
    if (!this.titleElement) return;
    const rect = this.titleElement.nativeElement.getBoundingClientRect();

    this.tooltipPosition.top = rect.top - 40 + window.scrollY;
    this.tooltipPosition.left = rect.left + rect.width / 2 + window.scrollX;
  }

  closeInfoTooltip() {
    this.showInfoTooltip = false;
  }
  close(): void {
    this.dialogRef.close();
  }
  private tryEndLoading(factureOk: boolean, carboneOk: boolean) {
  if (factureOk && carboneOk) {
    this.isLoading = false;
  }
}

 submit() {
  this.isLoading = true; 

  const usageId = this.data.usageId;
  if (!usageId) {
    console.error('Usage ID manquant');
    return;
  }

  const payload = {
    client_id: Number(localStorage.getItem('clientId')),
    product_id: this.data.product.id,
    duration_use: this.duration_use,
    nbr_use: this.nbr_use,
    periode_use: this.selectedPeriod
  };

  this.simulateurService.addSimulation(payload).subscribe({
    next: (res) => {
      this.simulationResult = res;
      const simId = res.id || res.simulation_id;

      this.facture = {
        electricite: 'Calcul en cours...',
        eau: 'Calcul en cours...',
        montant_total: 'Calcul en cours...'
      };

      let factureLoaded = false;
      let carboneLoaded = false;

      // 1. Facture
      this.energyBillService.calculateEnergyBill(simId).subscribe({
        next: () => {
          this.energyBillService.getBillBySimulationId(simId).subscribe({
            next: (data) => {
              this.facture = data;
              factureLoaded = true;
              this.tryEndLoading(factureLoaded, carboneLoaded);
            },
            error: (err) => {
              console.error('Erreur récupération facture:', err);
              this.facture = null;
              factureLoaded = true;
              this.tryEndLoading(factureLoaded, carboneLoaded);
            }
          });
        },
        error: (err) => {
          console.error('Erreur calcul facture:', err);
          this.facture = null;
          factureLoaded = true;
          this.tryEndLoading(factureLoaded, carboneLoaded);
        }
      });

      // 2. Impact carbone
      this.carbonService.getCarbonImpactByProduct(this.data.product.id).subscribe({
        next: (res) => {
          this.impactCarbone = res.impact_env;
          carboneLoaded = true;
          this.tryEndLoading(factureLoaded, carboneLoaded);
        },
        error: (err) => {
          console.error('Erreur impact carbone:', err);
          this.impactCarbone = null;
          carboneLoaded = true;
          this.tryEndLoading(factureLoaded, carboneLoaded);
        }
      });

      //  Met à jour l'état d'usage
      this.simulationService.setWithSimulation(usageId).subscribe({
        error: (err) => {
          console.error('Erreur updateWithSimulation', err);
        }
      });

      this.showResultsOnly = true;
    },
    error: (err) => {
      console.error('Erreur simulation:', err);
      this.isLoading = false;
    }
  });
}




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
results(){
      this.showResultsOnly = false;
      this.simulationResult=null;
      this.facture=null;
      this.impactCarbone=null;

}
get selectedPeriodLabel(): string {
  switch (this.selectedPeriod) {
    case 'month': return '30 jours';
    case 'three_months': return '90 jours';
    case 'year': return '1 an';
    default: return '';
  }
}

}
