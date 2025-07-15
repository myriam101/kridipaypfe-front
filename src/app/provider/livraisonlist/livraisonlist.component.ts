import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';
import { DeliveryService } from 'src/app/services/delivery.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-livraisonlist',
  templateUrl: './livraisonlist.component.html',
  styleUrls: ['./livraisonlist.component.css']
})
export class LivraisonlistComponent  implements OnInit {
  deliveries: any[] = [];
  providerId: any;
filterValidated: boolean = false;
providerAdress: string = '';
  constructor(private snackBar:MatSnackBar,private deliveryService: DeliveryService,private providerService:ProviderService, private dialog: MatDialog,) {}

  ngOnInit(): void {
        this.providerId = Number(localStorage.getItem('providerId'));
    this.loadDeliveries();
      this.loadProviderAdress();

  }

 loadDeliveries(): void {
  this.deliveryService.getDeliveriesByProvider(this.providerId, this.filterValidated).subscribe({
    next: (data) => this.deliveries = data,
    error: (err) => console.error(err)
  });
}

onValidateDelivery(deliveryId: number): void {
  const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '350px',
    data: {
      message: 'Voulez-vous vraiment valider cette livraison? cela la marquera comme expedié'
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
  this.deliveryService.validateDelivery(deliveryId).subscribe({
    next: () => {
      this.snackBar.open('Livraison validée avec succès.', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.loadDeliveries(); 
    },
    error: (err) => {
      const msg = err.status === 400
        ? 'Livraison déjà validée.'
        : 'Erreur lors de la validation.';
      this.snackBar.open(msg, 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }); }
  });
}
loadProviderAdress(): void {
  this.providerService.getProviderAdress(this.providerId).subscribe({
    next: (res) => {
      this.providerAdress = res.adress;
    },
    error: () => {
      this.providerAdress = 'Adresse non trouvée';
    }
  });}
}
