import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  product: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const productId = this.data.product?.id;

    if (productId) {
      this.productService.getProductDetails(productId).subscribe({
        next: (response) => {
          this.product = response;
        },
        error: (error) => {
          console.error('Erreur : ', error);
          this.snackBar.open('Erreur lors du chargement des détails du produit.', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      console.error('Product ID manquant !');
      this.snackBar.open('ID du produit manquant.', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  addToCart(): void {
    const clientId = Number(localStorage.getItem('clientId'));
    const productId = this.data.product?.id;

    if (clientId && productId) {
      this.productService.addToCart(clientId, productId).subscribe({
        next: () => {
          this.productService.refreshCartCount(clientId);
          this.snackBar.open('Produit ajouté au panier avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Échec de l’ajout au panier', error);
          this.snackBar.open('Une erreur s’est produite lors de l’ajout au panier.', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      console.error('Client ID ou Product ID manquant !');
      this.snackBar.open('Client ID ou Product ID manquant !', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

 // Méthode pour obtenir les clés de l'objet features
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
