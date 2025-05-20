import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalfactureComponent } from '../modalfacture/modalfacture.component';
import { SimulationService } from 'src/app/services/simulation.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  loading :boolean=true;
  constructor(  private simulationService: SimulationService,private cartService: ProductService,private router: Router,private snackBar: MatSnackBar,private dialog: MatDialog) {}

  ngOnInit(): void {
    const clientId = Number(localStorage.getItem('clientId'));
    this.loading=true;
    this.cartService.getCartDetails(clientId).subscribe({
      next: (data: any) => {
        this.cartItems = data;
            this.loading=false;

      },
      error: (err) => {
        console.error('Erreur de récupération du panier', err);
                    this.loading=false;

      }
    });
  }
  removeItem(index: number): void {
  const clientId = Number(localStorage.getItem('clientId'));
      if (clientId) {

  const item = this.cartItems[index];

  this.cartItems.splice(index, 1);

  this.snackBar.open('Élément supprimé avec succès', 'Fermer', {
    duration: 3000
  });

  this.cartService.removeItemFromCart(clientId, item.product_id).subscribe({
    next: () => {
    this.cartService.refreshCartCount(clientId);

    },
    error: (err) => {
      console.error('Erreur lors de la suppression de l\'élément', err);

      this.cartItems.splice(index, 0, item);  // Reinsert the item at the same index
      this.snackBar.open('Erreur lors de la suppression de l\'élément', 'Fermer', {
        duration: 3000
      });
    }
  });}

}


 closeCart() {
  this.router.navigate(['/client']);
}
showToast() {
  this.snackBar.open('Panier mis à jour avec succes', 'Fermer', {
    duration: 3000,
  });
}
estimateEnergyBill() {
  this.dialog.open(ModalfactureComponent, {
    width: '800px',
    data: {
      products: this.cartItems 
    }
  });
}
}
