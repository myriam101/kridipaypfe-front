import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  template: `
    <h2 mat-dialog-title>Confirmation</h2>

    <mat-dialog-content>
      {{ data.message || 'Voulez-vous vraiment effectuer cette action ?' }}
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Annuler</button>
      <button mat-button color="primary" (click)="dialogRef.close(true)">Valider</button>
    </mat-dialog-actions>
  `
})
export class ConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message?: string }
  ) {}
}
