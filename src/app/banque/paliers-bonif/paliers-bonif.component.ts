import { Component, OnInit } from '@angular/core';
import { BonifPalierBanqueService } from 'src/app/services/bonif-palier-banque.service';
import { AddPalierDialogComponent } from './add-palier-dialog/add-palier-dialog.component';
import { EditPalierDialogComponent } from './edit-palier-dialog/edit-palier-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';

@Component({
  selector: 'app-paliers-bonif',
  templateUrl: './paliers-bonif.component.html',
  styleUrls: ['./paliers-bonif.component.css']
})
export class PaliersBonifComponent implements OnInit {
  paliers: any[] = [];
  agentId!: number;
  isLoading = false;
  selectedPalierId: number | null = null;

  constructor(
    private palierService: BonifPalierBanqueService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.agentId = Number(localStorage.getItem('agentId'));
    this.loadPalier();
  }

  loadPalier(): void {
    this.palierService.getBonifPaliersByAgent(this.agentId).subscribe({
      next: data => this.paliers = data,
      error: () => this.paliers = []
    });
  }

  selectPalier(id: number) {
    this.selectedPalierId = this.selectedPalierId === id ? null : id;
  }

  getSelectedPalier() {
    return this.paliers.find(p => p.id === this.selectedPalierId) ?? null;
  }

  openAddPalierModal(): void {
    const dialogRef = this.dialog.open(AddPalierDialogComponent, {
      width: '480px',
      data: { agentId: this.agentId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadPalier();
      }
    });
  }

 openEditPalierModal(): void {
  const palier = this.getSelectedPalier();
  if (!palier) return;

  const dialogRef = this.dialog.open(EditPalierDialogComponent, {
    width: '480px',
    data: { palier, agentId: this.agentId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'refresh') {
      this.loadPalier();
      this.selectedPalierId = null;
    }
  });
}

confirmDeletePalier(): void {
  const palier = this.getSelectedPalier();
  if (!palier) return;

  const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '400px',
    data: {
      message: `Confirmez-vous la suppression du palier de ${palier.minPoints} à ${palier.maxPoints} points ?`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.deletePalier(palier.id);
    }
  });
}
  deletePalier(id: number): void {
    
    this.isLoading = true;
    this.palierService.deleteBonifPalier(id).subscribe({
      next: () => {
        this.snackBar.open('Palier supprimé avec succès !', 'Fermer', { duration: 3000 });
        this.loadPalier();
        this.selectedPalierId = null;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getTotalPointRange(): number {
    return this.paliers.reduce((sum, p) => sum + (p.maxPoints - p.minPoints + 1), 0);
  }

  getPalierWidth(palier: any, index: number): number {
    const total = this.getTotalPointRange();
    const current = (palier.maxPoints - palier.minPoints + 1);
    let width = (current / total) * 100;

    // Ajuste le dernier palier pour éviter le vide dû aux arrondis
    if (index === this.paliers.length - 1) {
      const sumSoFar = this.paliers
        .slice(0, -1)
        .reduce((acc, p) => acc + ((p.maxPoints - p.minPoints + 1) / total) * 100, 0);
      width = 100 - sumSoFar;
    }

    return +width.toFixed(2);
  }

  getGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #216490, #2980b9)',
      'linear-gradient(135deg, #3c8dbc, #3498db)',
      'linear-gradient(135deg, #5ba2cc, #7ac5f4)',
      'linear-gradient(135deg, #8ed0f7, #bde3fa)',
      'linear-gradient(135deg, #c9e8fa, #e4f5fd)'
    ];
    return gradients[index % gradients.length];
  }
}
