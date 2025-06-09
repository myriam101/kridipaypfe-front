import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({ selector: 'app-confirm-dialog-admin',
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>Voulez-vous vraiment effectuer cette action ?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Annuler</button>
      <button mat-button color="primary" (click)="dialogRef.close(true)">Valider</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogAdminComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
