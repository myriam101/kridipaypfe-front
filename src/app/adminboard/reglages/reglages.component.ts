import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarbonService } from 'src/app/services/carbon.service';
import { ProductService } from 'src/app/services/product.service';
import { SeuilBonifService } from 'src/app/services/seuil-bonif.service';
import { SeuilService } from 'src/app/services/seuil.service';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.component.html',
  styleUrls: ['./reglages.component.css']
})
export class ReglagesComponent implements OnInit {
  seuilsBonif: any[] = [];

  items = [
    {
      title: 'Gestion du seuil du score écologique des clients',
      key: 'seuil',
      expanded: false
    },
    {
      title: 'Gestion de la marge des points bonifiants',
      key: 'points',
      expanded: false
    },
     {
      title: 'Gestion du facteur d’emission CO2',
      key: 'facteur',
      expanded: false
    }
  ];

  facteur: number | null = null;
  date_facteur: string | null = null;
  new_facteur: number = 0;
  valeur: number | null = null;
  date: string | null = null;
  newValeur: number = 0;
  isLoading: boolean = false;
  message: string | undefined;

  constructor(private seuilBonifService: SeuilBonifService,
    private seuilService: SeuilService,
    private snackBar: MatSnackBar,
    private carbonService: CarbonService,private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadSeuil();
    this.loadFacteur();
    this.loadSeuilBonif();
  }

  toggle(index: number): void {
    this.items[index].expanded = !this.items[index].expanded;
  }

  loadSeuil() {
    this.isLoading = true;
    this.seuilService.getCurrentSeuil().subscribe({
      next: data => {
        this.valeur = data.valeur;
        this.date = data.date;
        this.isLoading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur lors du chargement du seuil.';
        this.showSnackBar(errorMessage, 5000, true);
        this.isLoading = false;
      }
    });
  }

  updateSeuil() {
    if (this.newValeur <= 0) {
      this.showSnackBar('La valeur du seuil doit être supérieure à 0.', 4000, true);
      return;
    }

    this.isLoading = true;

    this.seuilService.addOrUpdateSeuil(this.newValeur).subscribe({
      next: () => {
        this.showSnackBar('Seuil mis à jour avec succès.');
        this.loadSeuil();

        this.seuilService.calculateAllScores().subscribe({
          next: () => {
            this.showSnackBar('Scores des clients recalculés avec succès !');
            this.isLoading = false;
          },
          error: () => {
            this.showSnackBar('Erreur lors du recalcul des scores.', 5000, true);
            this.isLoading = false;
          }
        });

      },
      error: () => {
        this.showSnackBar('Erreur lors de la mise à jour du seuil.', 5000, true);
        this.isLoading = false;
      }
    });
  }

  showSnackBar(message: string, duration = 3000, isError = false) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }
  loadFacteur() {
    this.isLoading = true;
    this.carbonService.getCurrentFacteur().subscribe({
      next: data => {
        this.facteur = data.facteur;
        this.date_facteur = data.date_facteur;
        this.isLoading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur lors du chargement du facteur emission.';
        this.showSnackBar(errorMessage, 5000, true);
        this.isLoading = false;
      }
    });
  }
  updateFacteur() {
  if (this.new_facteur <= 0) {
    this.showSnackBar('La valeur doit être supérieure à 0.', 4000, true);
    return;
  }

  this.isLoading = true;

  this.carbonService.addOrUpdateFacteur(this.new_facteur).subscribe({
    next: () => {
      this.showSnackBar('Valeur du facteur mise à jour avec succès.');

      this.loadFacteur();

      //  Ensuite, appelle la mise à jour des carbons
      this.carbonService.updateAllCarbonValues().subscribe({
        next: () => {
          this.showSnackBar('Tous les impacts carbone ont été recalculés.');
          this.isLoading = false;
        },
        error: () => {
          this.showSnackBar('Erreur lors de la mise à jour des impacts carbone.', 5000, true);
          this.isLoading = false;
        }
      });
    },
    error: () => {
      this.showSnackBar('Erreur lors de la mise à jour du facteur.', 5000, true);
      this.isLoading = false;
    }
  });
}

  onFacteurInput(event: any) {
  const raw = event.target.value.trim().replace(',', '.');
  const parsed = parseFloat(raw);
  this.new_facteur = isNaN(parsed) ? 0 : parsed;
}

loadSeuilBonif() {
    this.seuilBonifService.getSeuilsBonif().subscribe({
      next: data => {this.seuilsBonif = data,
        console.log("data bonif",data);
      },
      error: err => this.message = 'Erreur chargement des seuils.'
    });
  }

  updateSeuilBonif(type: 'peu' | 'moyen' | 'eleve', valeur: number) {
    this.isLoading = true;
    const seuil: any = { type_badge: type, valeur };
    this.seuilBonifService.saveSeuilBonif(seuil).subscribe({
      next: () => {
         this.showSnackBar('Marge des points bonifiants mis à jour avec succès.');
        this.loadSeuilBonif();
      },
      error: () => this.showSnackBar('Erreur lors de la mise à jour des marges.'),
      complete: () => this.isLoading = false
    });
    this.onUpdateBonifPoints();
  }

 onUpdateBonifPoints(): void {
  this.isLoading = true;

  this.productService.updateBonifs().subscribe({
    next: (res) => {
      if (res.success) {
        this.showSnackBar(res.message);
      } else {
        this.showSnackBar('Une erreur s’est produite.', 4000, true);
      }
      this.isLoading = false;
    },
    error: () => {
      this.showSnackBar("Une erreur s'est produite lors de la mise à jour.", 5000, true);
      this.isLoading = false;
    }
  });
}



  getTooltip(type: string): string {
  switch (type) {
    case 'peu':
      return 'Badge PEU : Impact environnemental faible — encourage à privilégier ce produit en attribuant une marge plus élevée.';
    case 'moyen':
      return 'Badge MOYEN : Impact environnemental modéré — attribuer une valeur en dessous de celle du badge "PEU".';
    case 'eleve':
      return 'Badge ÉLEVÉ : Impact plus élevé — à limiter si possible, donc attribuer une valeur moindre voir zero.';
    default:
      return 'Type de badge inconnu';
  }
}

}
