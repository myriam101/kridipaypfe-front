import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalfactureComponent } from '../modalfacture/modalfacture.component';
import { SimulationService } from 'src/app/services/simulation.service';
import { EnergybillService } from 'src/app/services/energybill.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  loading: boolean = true;
  emptyCartMessage: string | null = null;
  disableValidateBtn: boolean = false;

  constructor(
    private simulationService: SimulationService,
    private cartService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private EnergyBillService: EnergybillService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const clientId = Number(localStorage.getItem('clientId'));
    if (!clientId) {
      this.cartItems = [];
      this.emptyCartMessage = "Client non identifié.";
      this.loading = false;
      return;
    }

    this.loading = true;
    this.cartService.getCartDetails(clientId).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.cartItems = data;
          this.emptyCartMessage = null;
        } else if (data.message) {
          this.cartItems = [];
          this.emptyCartMessage = data.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.cartItems = [];
        this.loading = false;
        this.emptyCartMessage = "Le panier est vide.";
        console.error('Erreur de récupération du panier', err);
      }
    });
  }

 removeItem(index: number): void {
  const clientId = Number(localStorage.getItem('clientId'));
  if (!clientId) return;

  const item = this.cartItems[index];
  this.cartItems.splice(index, 1);

  // Si plus aucun article, afficher message panier vide
  if (this.cartItems.length === 0) {
    this.emptyCartMessage = "Le panier est vide.";
  }

  this.snackBar.open('Élément supprimé avec succès', 'Fermer', { duration: 3000 });

  this.cartService.removeItemFromCart(clientId, item.product_id).subscribe({
    next: () => {
      this.cartService.refreshCartCount(clientId);
    },
    error: (err) => {
      console.error('Erreur lors de la suppression de l\'élément', err);
      this.cartItems.splice(index, 0, item); // Réinsertion de l'élément en cas d'erreur
      this.emptyCartMessage = null; // Enlever message panier vide car échec suppression
      this.snackBar.open('Erreur lors de la suppression de l\'élément', 'Fermer', { duration: 3000 });
    }
  });
}


  closeCart() {
    this.router.navigate(['/client']);
  }

  showToast() {
    this.snackBar.open('Panier mis à jour avec succes', 'Fermer', { duration: 3000 });
  }

  estimateEnergyBill() {
    this.dialog.open(ModalfactureComponent, {
      width: '800px',
      data: { products: this.cartItems }
    });
  }

  validate(): void {
    const clientId = Number(localStorage.getItem('clientId'));
    if (!clientId) {
      this.snackBar.open('Client non identifié', 'Fermer', { duration: 3000 });
      return;
    }

    this.disableValidateBtn = true;

    this.cartService.validateCartByclient(clientId).subscribe({
      next: () => {
        this.snackBar.open('Commande validée avec succès.', 'Fermer', { duration: 4000 });
        this.disableValidateBtn = false;

        // Après validation, on recharge le panier (potentiellement vide ou mis à jour)
        this.loadCart();
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la validation.', 'Fermer', { duration: 4000 });
        this.disableValidateBtn = false;
      }
    });
  }

  downloadPdf(pdfBlob: Blob, fileName: string) {
    const blob = new Blob([pdfBlob], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
