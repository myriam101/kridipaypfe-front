import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartsComponent  implements OnInit {
waitingCarts: any[] = [];
validCarts: any[] = [];
cancelledcarts: any[] = [];

  cartLoadError: boolean = false;
  isLoading: boolean = true;
  activeTab: string = 'waiting';
  providerId: any;

constructor(private cartService: ProductService,private snackBar: MatSnackBar,  private dialog: MatDialog,
) {}


ngOnInit(): void {
  this.providerId = Number(localStorage.getItem('providerId'));
  this.getWaintingCarts();
  this.getCancelledCarts();
  this.getvalidatedCarts();
}
getWaintingCarts(): void {
 this.cartService.getAllWaitingCarts(this.providerId).subscribe({
  next: (data) => {
    this.waitingCarts = data;
    this.isLoading = false;

    // Pour chaque panier : vérifier statut du fournisseur
    this.waitingCarts.forEach(cart => {
      this.cartService.checkProviderStatus(cart.cart_id, this.providerId).subscribe({
        next: (res) => {
          cart.providerStatus = res.status;      // 'waiting' | 'validated' | 'not_validated'
          cart.providerMessage = res.message;
        },
        error: () => {
          cart.providerStatus = 'error';
          cart.providerMessage = "Erreur lors de la vérification du statut";
        }
      });
    });
  },
  error: (err) => {
    this.cartLoadError = err.status !== 404;
    this.waitingCarts = [];
  }
});

}

getvalidatedCarts(): void {
  this.cartService.getAllValidatedCarts(this.providerId).subscribe({
    next: (data) => {
        this.validCarts = data;
        this.isLoading = false;
      },
       error: (err) => {
    if (err.status === 404) {
      this.validCarts = [];
      this.cartLoadError = false;
    } else {
      this.cartLoadError = true; 
    }
  }
  });
}
getCancelledCarts(): void {
  this.cartService.getAllCancelledCarts(this.providerId).subscribe({
    next: (data) => {
        this.cancelledcarts = data;
        this.isLoading = false;
      },
       error: (err) => {
    if (err.status === 404) {
      this.cancelledcarts = [];
      this.cartLoadError = false;
    } else {
      this.cartLoadError = true; 
    }
  }
  });
}
onValidateCart(cartId: number) {
  this.providerId = Number(localStorage.getItem('providerId'));
 const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '350px',
    data: {
      message: 'Voulez-vous vraiment valider cette commande?'
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.cartService.validateCart(cartId,this.providerId).subscribe({
        next: () => {
          this.snackBar.open('Panier validé avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.getvalidatedCarts();
          this.getWaintingCarts();
          this.getCancelledCarts();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la validation.', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  });
}
onCancelCart(cartId: number) {
const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '350px',
    data: {
      message: 'Voulez-vous vraiment annuler cette commande?'
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.cartService.cancelCart(cartId,this.providerId).subscribe({
        next: () => {
          this.snackBar.open('Panier annulé avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.getvalidatedCarts();
          this.getWaintingCarts();
          this.getCancelledCarts();
        },
        error: () => {
          this.snackBar.open('Erreur lors de l annulation.', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  });
}


}
