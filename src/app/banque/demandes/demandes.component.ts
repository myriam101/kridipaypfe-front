import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';
import { ConfirmDialogComponent } from 'src/app/provider/confirm-dialog/confirm-dialog.component';
import { BonifPalierBanqueService } from 'src/app/services/bonif-palier-banque.service';
import { DossierService } from 'src/app/services/dossier.service';

@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.css']
})
export class DemandesComponent implements OnInit {

  dossiers: any[] = [];
  originalDossiers: any[] = [];
  message: string = '';
  isLoading = true;
  agentId: any;
  activeTooltipId: number | null = null;
  tooltipTimeout: any;

  activeFilters = {
    low: false,
    medium: false,
    high: false
  };

  constructor(private palierService:BonifPalierBanqueService, private dossierService: DossierService,private snackBar: MatSnackBar,  private dialog: MatDialog) {}

  ngOnInit(): void {
    this.agentId = Number(localStorage.getItem('agentId'));
    this.loadDossiers(this.agentId);
    
  }
getBadgeKeys(obj: any): string[] {
  return Object.keys(obj);
}

 loadDossiers(id: any): void {
  this.isLoading = true;
  this.dossierService.getDossiersEncoursByAgent(id).subscribe({
    next: (response) => {
      this.isLoading = false;

      if (Array.isArray(response) && response.length > 0) {
        const formatted = response.map(d => ({
          ...d,
          date_creation: new Date(d.date_creation.date)
        }));

        this.dossiers = formatted;
        this.originalDossiers = formatted;
        this.message = '';

        // Charger les paliers pour chaque dossier
        this.dossiers.forEach(dossier => {
          this.palierService.getPalierForDossier(dossier.dossierId).subscribe({
            next: palier => {
              dossier.palier = palier;
            },
            error: () => {
              dossier.palier = null;
            }
          });
        });

      } else if (response.message) {
        this.message = response.message;
        this.dossiers = [];
      } else {
        this.message = "Il n'y a pas encore de dossiers";
        this.dossiers = [];
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.message = error.error?.error || 'Erreur serveur';
      this.dossiers = [];
    }
  });
}

  toggleFilter(type: 'low' | 'medium' | 'high') {
    this.activeFilters[type] = !this.activeFilters[type];
    this.applyFilters();
  }

 applyFilters() {
  const selectedBadges: string[] = [];

  if (this.activeFilters.low) selectedBadges.push('Peu');
  if (this.activeFilters.medium) selectedBadges.push('Moyen');
  if (this.activeFilters.high) selectedBadges.push('Élevé');

  this.isLoading = true;

  // Relancer l’appel avec les filtres de badge actifs
  this.dossierService.getDossiersEncoursByAgent(this.agentId, selectedBadges).subscribe({
    next: (response) => {
      this.isLoading = false;

      if (Array.isArray(response) && response.length > 0) {
        const formatted = response.map(d => ({
          ...d,
          date_creation: new Date(d.date_creation.date)
        }));

        this.dossiers = formatted;
        this.originalDossiers = formatted;
        this.message = '';
      } else if (response.message) {
        this.message = response.message;
        this.dossiers = [];
      } else {
        this.message = "Il n'y a pas encore de dossiers";
        this.dossiers = [];
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.message = error.error?.error || 'Erreur serveur';
      this.dossiers = [];
    }
  });
}


  toggleTooltip(dossierId: number) {
    if (this.activeTooltipId === dossierId) {
      this.activeTooltipId = null;
      clearTimeout(this.tooltipTimeout);
    } else {
      this.activeTooltipId = dossierId;
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = setTimeout(() => {
        this.activeTooltipId = null;
      }, 4000);
    }
  }
onValidateDossier(dossierId: number) {
  const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '400px',
    data: {
      message: 'Souhaitez-vous valider et clôturer ce dossier ? Les points bonifiants seront ajoutés au client.'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.agentId = Number(localStorage.getItem('agentId'));

      this.dossierService.validateAndAddPoints(dossierId).subscribe({
        next: () => {
          this.snackBar.open('Dossier clôturé avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadDossiers(this.agentId);
        },
        error: (err) => {
          if (err.status === 403) {
            this.snackBar.open('Dossier clôturé avec succès !', 'Fermer', {
              duration: 3000,
              panelClass: ['snackbar-info'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.loadDossiers(this.agentId);
          } else {
            this.snackBar.open('Erreur lors de la clôture ou de l\'ajout des points.', 'Fermer', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        }
      });
    }
  });
}


}
