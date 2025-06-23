import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-modal',
  template: `
    <h2 mat-dialog-title>Déconnexion</h2>
    <mat-dialog-content>
      Êtes-vous sûr de vouloir vous déconnecter ?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-button color="warn" (click)="onLogout()">Se déconnecter</button>
    </mat-dialog-actions>
  `,
})
export class LogoutModalComponent {
 constructor(private dialogRef: MatDialogRef<LogoutModalComponent>) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onLogout() {
    this.dialogRef.close(true);
  }
}
