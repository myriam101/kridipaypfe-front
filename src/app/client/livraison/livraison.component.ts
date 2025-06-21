import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent {
constructor(
    public dialogRef: MatDialogRef<LivraisonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fermer() {
    this.dialogRef.close();
  }

  confirmerLivraison() {
    // Exemple de callback ou traitement à la confirmation
    this.dialogRef.close({ confirmed: true });
  }
}
