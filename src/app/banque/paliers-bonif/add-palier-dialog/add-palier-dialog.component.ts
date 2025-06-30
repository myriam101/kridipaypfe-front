import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BonifPalierBanqueService } from 'src/app/services/bonif-palier-banque.service';

@Component({
  selector: 'app-add-palier-dialog',
  templateUrl: './add-palier-dialog.component.html',
  styleUrls: ['./add-palier-dialog.component.css']
})
export class AddPalierDialogComponent {
 palierForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPalierDialogComponent>,
    private palierService: BonifPalierBanqueService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.palierForm = this.fb.group({
      minPoints: ['', [Validators.required, Validators.min(0)]],
      maxPoints: ['', [Validators.required, Validators.min(1)]],
      customInterestRate: ['', [Validators.required, Validators.min(0)]]
    });
  }

  submit() {
    if (this.palierForm.invalid) {
      return;
    }

    const { minPoints, maxPoints, customInterestRate } = this.palierForm.value;

    if (minPoints >= maxPoints) {
      this.snackBar.open('Le minimum doit être inférieur au maximum.', 'Fermer', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.palierService.addBonifPalier(this.data.agentId, { minPoints, maxPoints, customInterestRate }).subscribe({
      next: (res) => {
        this.snackBar.open('Palier ajouté avec succès !', 'Fermer', { duration: 3000 });
        this.isLoading = false;
        this.dialogRef.close('refresh');
      },
      error: (err) => {
        this.isLoading = false;
        const message = err.error?.error || 'Erreur serveur lors de l\'ajout.';
        this.snackBar.open(message, 'Fermer', { duration: 4000 });
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
