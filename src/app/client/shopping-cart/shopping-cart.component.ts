import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: ProductService,private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const clientId = Number(localStorage.getItem('clientId'));
    this.cartService.getCartDetails(clientId).subscribe({
      next: (data: any) => {
        this.cartItems = data;
      },
      error: (err) => {
        console.error('Erreur de récupération du panier', err);
      }
    });
  }
  removeItem(index: number): void {
  const clientId = Number(localStorage.getItem('clientId'));
      if (clientId) {

  // Get the item to be removed by its index
  const item = this.cartItems[index];

  // Remove the item locally by using the index
  this.cartItems.splice(index, 1);

  // Show success message
  this.snackBar.open('Élément supprimé avec succès', 'Fermer', {
    duration: 3000
  });

  // Call the backend to remove the item
  this.cartService.removeItemFromCart(clientId, item.product_id).subscribe({
    next: () => {
    this.cartService.refreshCartCount(clientId);

    },
    error: (err) => {
      console.error('Erreur lors de la suppression de l\'élément', err);

      // If there's an error, restore the item back to the cart
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

}
