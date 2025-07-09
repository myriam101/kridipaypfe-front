import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';
import { BonifPalierBanqueService } from 'src/app/services/bonif-palier-banque.service';

@Component({
  selector: 'app-edit-palier-dialog',
  templateUrl: './edit-palier-dialog.component.html',
  styleUrls: ['./edit-palier-dialog.component.css']
})
export class EditPalierDialogComponent {
  palierForm: FormGroup;
  isLoading = false;

  constructor(
    private dialog:MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPalierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { palier: any; agentId: number },
    private palierService: BonifPalierBanqueService, private snackbar: MatSnackBar
  ) {
    this.palierForm = this.fb.group({
      minPoints: [data.palier.minPoints, [Validators.required, Validators.min(0)]],
      maxPoints: [data.palier.maxPoints, [Validators.required, Validators.min(0)]],
      customInterestRate: [data.palier.customInterestRate, [Validators.required, Validators.min(0)]]
    });
  }
 

  cancel(): void {
    this.dialogRef.close();
  }
submit(): void {
  if (this.palierForm.invalid) return;

  const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '400px',
    data: {
      message: `Confirmez-vous la mise à jour de ce palier (de ${this.palierForm.value.minPoints} à ${this.palierForm.value.maxPoints} points) ?`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.isLoading = true;

      this.palierService.updateBonifPalier(this.data.palier.id, this.palierForm.value).subscribe({
        next: () => {
        this.snackbar.open('Palier modifé avec succès !', 'Fermer', { duration: 3000 });
        this.dialogRef.close('refresh')
        
      },
error: (err) => {
        this.isLoading = false;
        const message = err.error?.error || 'Erreur serveur lors de l\'ajout.';
        this.snackbar.open(message, 'Fermer', { duration: 4000 });
      }      });
    }
  });
}

}
