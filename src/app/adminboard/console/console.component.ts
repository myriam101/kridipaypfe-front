import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsoleService } from 'src/app/services/console.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {
  priceForm!: FormGroup;
  priceWaterForm!: FormGroup;
  isLoading: boolean = false;
  electricityPrices: any[] = [];
  waterPrices: any[] = [];
editElectricityId: number | null = null;
editWaterId: number | null = null;
loadingElectricityId: number | null = null;
loadingWaterId: number | null = null;

showElectricityForm = false;
showWaterForm = false;

  constructor(
    private fb: FormBuilder,
    private priceService: ConsoleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.priceForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      sector: ['', Validators.required],
      tranche_elect: ['', Validators.required]
    });
    // Formulaire eau
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
      this.priceForm.markAllAsTouched(); // Pour afficher les erreurs
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
      this.isLoading = true;
      this.priceService.getAllElectricityPrices().subscribe(data => {
      this.electricityPrices = data;
      this.isLoading = false;
    });
     }
     getListWater() {
      this.isLoading = true;
      this.priceService.getAllWaterPrices().subscribe(data => {
      this.waterPrices = data;
      this.isLoading = false;
    });
     }
     onEdit(price: any) {
  // Ouvre un formulaire pré-rempli ou toggle l'édition
  console.log('Modifier', price);
}

onDeleteElect(price: any) {
  if (confirm('Voulez-vous vraiment supprimer ce tarif ?')) {
    this.priceService.deleteElectricityPrice(price.id).subscribe(() => {
    this.getListElectri(); // pour recharger la liste
  });
    // Appelle ta méthode de suppression ici
    console.log('Supprimer', price);
    // Exemple :
    // this.priceService.deleteElectricityPrice(price.id).subscribe(...);
  }}
  
onDeleteWater(price: any) {
  if (confirm('Voulez-vous vraiment supprimer ce tarif ?')) {
    this.priceService.deleteWaterPrice(price.id).subscribe(() => {
    this.getListWater(); // pour recharger la liste
  });
    // Appelle ta méthode de suppression ici
    console.log('Supprimer', price);
    // Exemple :
    // this.priceService.deleteElectricityPrice(price.id).subscribe(...);
  }
}
saveElectricity(e: any): void {
  const updatedData = {
    sector: e.sector, // récupère les valeurs modifiées
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
        this.showSnackBar('✅ Toutes les tranches sont présentes et uniques.');
      } else {
        let message = '';
        if (missing.length > 0) {
          message += `❌ Tranches manquantes : ${missing.join(', ')}.\n`;
        }
        if (duplicates.length > 0) {
          message += `⚠️ Doublons : ${duplicates.join(', ')}.`;
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
          verticalPosition: 'top'
        });
      } else {
        let message = '';

        if (res.missing_combinations.length > 0) {
          message += `🔴 Tranches manquantes :\n`;
          res.missing_combinations.forEach((item: any) => {
            message += `- ${item.sector} / ${item.tranche}\n`;
          });
        }

        if (res.duplicates.length > 0) {
          message += `\n🟠 Doublons détectés :\n`;
          res.duplicates.forEach((item: any) => {
            message += `- ${item.sector} / ${item.tranche} (id: ${item.id})\n`;
          });
        }

        this.snackBar.open(message, 'Fermer', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
                });
      }
    },
    error: (err) => {
      this.snackBar.open('Erreur lors de la vérification des tarifs.', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'      });
    }
  });
}

}
