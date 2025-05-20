import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';

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

constructor(private cartService: ProductService,private snackBar: MatSnackBar) {}


ngOnInit(): void {
  this.getWaintingCarts();
  this.getCancelledCarts();
  this.getvalidatedCarts();
}

getWaintingCarts(): void {
  this.cartService.getAllWaitingCarts().subscribe({
    next: (data) => {
        this.waitingCarts = data;
        this.isLoading = false;
      },
       error: (err) => {
    if (err.status === 404) {
      this.waitingCarts = []; // Aucun panier
      this.cartLoadError = false;
    } else {
      this.cartLoadError = true; // Erreur serveur
    }
  }
  });
}
getvalidatedCarts(): void {
  this.cartService.getAllValidatedCarts().subscribe({
    next: (data) => {
        this.validCarts = data;
        this.isLoading = false;
      },
       error: (err) => {
    if (err.status === 404) {
      this.validCarts = []; // Aucun panier
      this.cartLoadError = false;
    } else {
      this.cartLoadError = true; // Erreur serveur
    }
  }
  });
}
getCancelledCarts(): void {
  this.cartService.getAllCancelledCarts().subscribe({
    next: (data) => {
        this.cancelledcarts = data;
        this.isLoading = false;
      },
       error: (err) => {
    if (err.status === 404) {
      this.cancelledcarts = []; // Aucun panier
      this.cartLoadError = false;
    } else {
      this.cartLoadError = true; // Erreur serveur
    }
  }
  });
}
onValidateCart(cartId: number) {
  this.cartService.validateCart(cartId).subscribe({
    next: (res) => {
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
    error: (err) => {
      this.snackBar.open('Erreur lors de la validation.', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  });
}


}
