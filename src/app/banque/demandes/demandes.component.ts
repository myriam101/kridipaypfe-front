import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/provider/confirm-dialog/confirm-dialog.component';
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

  constructor(private dossierService: DossierService,private snackBar: MatSnackBar,  private dialog: MatDialog) {}

  ngOnInit(): void {
    this.agentId = Number(localStorage.getItem('agentId'));
    this.loadDossiers(this.agentId);
    
  }
 loadDossiers(id: any): void {
this.dossierService.getDossiersByAgent(id).subscribe({
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

          this.dossiers.forEach(dossier => {
            this.dossierService.getProductStatsByDossierId(dossier.dossierId).subscribe({
              next: (stats) => {
                dossier.nbProducts = stats.total_products;
                dossier.nbLowBadgeProducts = stats.low_impact_count;
              },
              error: () => {
                dossier.nbProducts = 0;
                dossier.nbLowBadgeProducts = 0;
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

    if (this.activeFilters.low) selectedBadges.push('1');
    if (this.activeFilters.medium) selectedBadges.push('2');
    if (this.activeFilters.high) selectedBadges.push('3');

    if (selectedBadges.length === 0) {
      this.dossiers = [...this.originalDossiers];
      return;
    }

    const dossierIds = this.originalDossiers.map(d => d.dossierId);
    this.isLoading = true;

    this.dossierService.filterDossiersByBadge({
      ids: dossierIds,
      badges: selectedBadges
    }).subscribe({
      next: (filtered) => {
        this.isLoading = false;

        if (Array.isArray(filtered) && filtered.length > 0) {
          this.dossiers = filtered.map(d => ({
            ...d,
            date_creation: new Date(d.date_creation.date)
          }));

          this.message = '';

          // Appeler les stats sur les dossiers filtrés
          this.dossiers.forEach(dossier => {
            this.dossierService.getProductStatsByDossierId(dossier.dossierId).subscribe({
              next: (stats) => {
                dossier.nbProducts = stats.total_products;
                dossier.nbLowBadgeProducts = stats.low_impact_count;
              },
              error: () => {
                dossier.nbProducts = 0;
                dossier.nbLowBadgeProducts = 0;
              }
            });
          });

        } else {
          this.dossiers = [];
          this.message = 'Aucun dossier ne correspond aux filtres sélectionnés.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.message = "Erreur lors du filtrage des dossiers.";
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
  const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
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
