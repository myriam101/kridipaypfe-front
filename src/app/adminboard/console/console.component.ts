import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsoleService } from 'src/app/services/console.service';
import { ProgresscrapperComponent } from '../progresscrapper/progresscrapper.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  priceForm!: FormGroup;
  priceWaterForm!: FormGroup;
  isLoading: boolean = false;
  isLoadingElect: boolean = false;
  message = '';

  electricityPrices: any[] = [];
  waterPrices: any[] = [];
  editElectricityId: number | null = null;
  editWaterId: number | null = null;
  loadingElectricityId: number | null = null;
  loadingWaterId: number | null = null;
  showElectricityForm = false;
  showWaterForm = false;
  isScrapingElectricity = false;
  isScrapingWater = false;
  selectedSector: any;

  constructor(
    private fb: FormBuilder,
    private priceService: ConsoleService,
    private snackBar: MatSnackBar,private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.priceForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      sector: ['', Validators.required],
      tranche_elect: ['', Validators.required]
    });
    this.priceWaterForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      tranche_eau: ['', Validators.required]
    });
    this.getListElectri();
    this.getListWater();
    
  }
showSnackBar(message: string, duration = 3000, isError = false) {
  this.snackBar.open(message, 'Fermer', {
    duration,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: isError ? 'snackbar-error' : 'snackbar-success'
  });
}


  submitPrice() {
    if (this.priceForm.invalid) {
      this.priceForm.markAllAsTouched(); 
      return;
    }

    const data = this.priceForm.value;
        this.isLoading = true;

    this.priceService.addElectricityPrice(data).subscribe({
      next: (res) => {
        this.showSnackBar(res.message || 'Tarif ajouté avec succès !');
        this.isLoading = false;

      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur inconnue';
this.showSnackBar(errorMessage, 5000, true); 
                      this.isLoading = false;
      }
    });
  }
   submitWaterPrice() {
    if (this.priceWaterForm.invalid) {
      this.priceWaterForm.markAllAsTouched();
      return;
    }

    const data = this.priceWaterForm.value;
        this.isLoading = true;

    this.priceService.addWaterPrice(data).subscribe({
      next: (res) => {
        this.showSnackBar(res.message || 'Tarif eau ajouté avec succès !');
                      this.isLoading = false;

      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur inconnue';
this.showSnackBar(errorMessage, 5000, true); 
                      this.isLoading = false;

      }
    });
  }
     getListElectri() {
  this.isLoadingElect = true;
  this.priceService.getAllElectricityPrices(this.selectedSector).subscribe(data => {
    this.electricityPrices = data;
    this.isLoadingElect = false;
  });
}

filterBySector(sector: string | null) {
  this.electricityPrices=[]
  this.selectedSector = sector;
  this.getListElectri();
}
     getListWater() {
      this.isLoading = true;
      this.priceService.getAllWaterPrices().subscribe(data => {
      this.waterPrices = data;
      this.isLoading = false;
    });
     }
     onEdit(price: any) {
  console.log('Modifier', price);
}

onDeleteElect(price: any) {
  if (confirm('Voulez-vous vraiment supprimer ce tarif ?')) {
    this.priceService.deleteElectricityPrice(price.id).subscribe(() => {
    this.getListElectri(); 
  });
    console.log('Supprimer', price);
   
  }}
  
onDeleteWater(price: any) {
  if (confirm('Voulez-vous vraiment supprimer ce tarif ?')) {
    this.priceService.deleteWaterPrice(price.id).subscribe(() => {
    this.getListWater();
  });
    console.log('Supprimer', price);

  }
}
saveElectricity(e: any): void {
  const updatedData = {
    sector: e.sector, 
    tranche_elect: e.tranche_elect,
    price: e.price
  };
  this.loadingElectricityId = e.id;
  this.priceService.updateElectricityPrice(e.id,updatedData).subscribe({
    next: () => {
      this.editElectricityId = null;
      this.loadingElectricityId = null;
      this.snackBar.open('Tarif électricité mis à jour avec succès', 'Fermer', { duration: 3000 });
      this.getListElectri();
    },
    error: (err) => {
  this.loadingElectricityId = null;
  const errorMessage = err.error?.message || err.error?.error || 'Erreur lors de la mise à jour du tarif électricité';
  this.snackBar.open(errorMessage, 'Fermer', { duration: 3000 });
}

  });
}

saveWater(a: any): void {
  const updatedData = {
    tranche_eau: a.tranche_eau,
    price: a.price
  };
  this.loadingWaterId = a.id;
  this.priceService.updateWaterPrice(a.id,updatedData).subscribe({
    next: () => {
      this.editWaterId = null;
      this.loadingWaterId = null;
      this.snackBar.open('Tarif eau mis à jour avec succès', 'Fermer', { duration: 3000 });
      this.getListWater();
    },
   error: (err) => {
  this.loadingWaterId = null;
  const errorMessage = err.error?.message || err.error?.error || 'Erreur lors de la mise à jour du tarif eau';
  this.snackBar.open(errorMessage, 'Fermer', { duration: 3000 });
}

  });
}

onEditElectricity(e: any): void {
  this.editElectricityId = e.id;
}

onEditWater(a: any): void {
  this.editWaterId = a.id;
}
checkTranchesEau(): void {
  this.priceService.checkWaterTranches().subscribe({
    next: (res) => {
      const { missing, duplicates, is_complete } = res;

      if (is_complete) {
        this.showSnackBar(' Toutes les tranches sont présentes et uniques.');
      } else {
        let message = '';
        if (missing.length > 0) {
          message += ` Tranches manquantes : ${missing.join(', ')}.\n`;
        }
        if (duplicates.length > 0) {
          message += ` Doublons : ${duplicates.join(', ')}.`;
        }
        this.showSnackBar(message, 7000);
      }
    },
    error: () => {
      this.showSnackBar('Erreur lors de la vérification des tranches.', 5000);
    }
  });
}
checkElectricityPriceCombinations() {
  this.priceService.checkElectricityPrices().subscribe({
    next: (res) => {
      if (res.status === 'ok') {
        this.snackBar.open('Toutes les combinaisons secteur/tranche sont bien définies.', 'Fermer', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      } else {
        let message = '';

        if (res.missing_combinations.length > 0) {
          message += ` Tranches manquantes :\n`;
          res.missing_combinations.forEach((item: any) => {
            message += `- ${item.sector} / ${item.tranche}\n`;
          });
        }

        if (res.duplicates.length > 0) {
          message += `\n Doublons détectés :\n`;
          res.duplicates.forEach((item: any) => {
            message += `- ${item.sector} / ${item.tranche} (id: ${item.id})\n`;
          });
        }

        this.snackBar.open(message, 'Fermer', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
                });
      }
    },
    error: (err) => {
      this.snackBar.open('Erreur lors de la vérification des tarifs.', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'      });
    }
  });
}
 /*onUpdateTarifs(): void {
    this.priceService.processTarifs().subscribe({
      next: (res) => {
      this.snackBar.open('Mise à jour réussie depuis STEG.com.tn !', 'Fermer', { duration: 4000 });
      this.getListElectri();
      console.log(res);
      },
      error: (err) => {
        this.snackBar.open(' Erreur lors de la mise à jour : ' + err.message, 'Fermer', { duration: 3000 });
        console.error(err);
      }
    });
  }*/
  onUpdateTarifs() {
  const dialogRef = this.dialog.open(ProgresscrapperComponent, {
      width: '600px',
    disableClose: true,
    data: { message: 'Étape 1/3 : Extraction des données depuis le site STEG...' }
  });

  dialogRef.componentInstance.updateStep(1, 'Étape 1/3 : Extraction des données depuis le site STEG...');

  setTimeout(() => {
    dialogRef.componentInstance.updateStep(2, 'Étape 2/3 : Génération du fichier JSON...');

    setTimeout(() => {
      dialogRef.componentInstance.updateStep(3, 'Étape 3/3 : Mise à jour de la base de données...');

      this.priceService.processTarifs().subscribe({
        next: (res) => {
          dialogRef.componentInstance.updateStep(3, 'Mise à jour réussie depuis STEG.com.tn !');
          dialogRef.componentInstance.allowClose();
        this.getListElectri();
          setTimeout(() => dialogRef.close(), 3000);
        },
        error: (err) => {
          dialogRef.componentInstance.updateStep(3, 'Erreur : ' + err.message);
          dialogRef.componentInstance.allowClose();
        }
      });
    }, 1000);
  }, 1000);
}
}
