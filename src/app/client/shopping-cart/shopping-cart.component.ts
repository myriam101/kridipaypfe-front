import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalfactureComponent } from '../modalfacture/modalfacture.component';
import { SimulationService } from 'src/app/services/simulation.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { ConfirmDialogComponent } from 'src/app/provider/confirm-dialog/confirm-dialog.component';
import { LivraisonComponent } from '../livraison/livraison.component';
import { DeliveryService, WeightsByProvider } from 'src/app/services/delivery.service';

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
  currentRoute: string = '';
  idcart:any;
  constructor( private deliveryService:DeliveryService,private route: ActivatedRoute,
    private cartService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog  )
{
  this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });
    }

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
      if (data && Array.isArray(data.products)) {
        this.cartItems = data.products;
        this.idcart = data.cart_id; 
        console.log("id cart",this.idcart)
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
      this.cartItems.splice(index, 0, item); 
      this.emptyCartMessage = null; 
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

 isCartEmpty(): boolean {
  return this.cartItems.length === 0;
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
  getTotalBonifPoints(): number {
  return this.cartItems
    .filter(item => item.visible === 1)
    .reduce((total, item) => total + (item.points * item.quantity), 0);
}
 openDelivery() {
  this.deliveryService.setCartId(this.idcart);
  this.deliveryService.getCartWeightByProvider(this.idcart).subscribe({
      next: (res) => {
        const weightsByProvider: WeightsByProvider = res.weights_by_provider_kg;
        this.deliveryService.setCartWeightsByProvider(weightsByProvider); 

        console.log('Poids par fournisseur reçus et stockés:', weightsByProvider);

       this.router.navigate(['delivery'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error("Erreur lors du calcul du poids du panier par fournisseur", err);
        this.snackBar.open("Erreur lors du calcul du poids du panier", "Fermer", { duration: 3000 });
      }
    });
  }

}
