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
  
  removeItem(item: any): void {
    const clientId = Number(localStorage.getItem('clientId'));
    this.cartService.removeItemFromCart(clientId, item.product_id).subscribe({
      next: () => {
        // Met à jour l'interface après la suppression
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'élément', err);
      }
    });
  }
  

 closeCart() {
  this.router.navigate(['/client']);
}
showToast() {
  this.snackBar.open('Panier mis à jour avec succes', 'Close', {
    duration: 3000,
  });
}

}
