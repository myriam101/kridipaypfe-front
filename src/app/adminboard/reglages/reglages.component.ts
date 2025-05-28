import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeuilService } from 'src/app/services/seuil.service';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.component.html',
  styleUrls: ['./reglages.component.css']
})
export class ReglagesComponent implements OnInit {
  valeur: number | null = null;
  date: string | null = null;
  newValeur: number = 0;
isLoading: boolean = false;

  constructor(private seuilService: SeuilService, private snackBar: MatSnackBar) {}

  showSnackBar(message: string, duration = 3000, isError = false) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }

  ngOnInit(): void {
    this.loadSeuil();
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
        next: (res) => {
          this.showSnackBar('Scores des clients recalculés avec succès !');
          this.isLoading = false; 
        },
        error: (err) => {
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

}
