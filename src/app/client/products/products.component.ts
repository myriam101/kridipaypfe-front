import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CarbonService } from '../../services/carbon.service';
import { MatDialog } from '@angular/material/dialog'; // Importer MatDialog
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { SimulateurComponent } from '../simulateur/simulateur.component';
import { ClientService } from 'src/app/services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimulatorUsageService } from 'src/app/services/simulator-usage.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnChanges,OnInit {
  @Input() catalogId!: number;
  products: any[] = [];
  isLoading :boolean= false;
  carbonBadges: { [key: number]: string } = {}; 
  clientId: number | null = null;  

  constructor(private simulationService: SimulatorUsageService
,private productService: ProductService, private carbonService: CarbonService,private dialog: MatDialog,private clientService:ClientService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.clientId = Number(localStorage.getItem('clientId'));

  }
  ngOnChanges() {
  if (this.catalogId) {
    this.products = [];
    this.carbonBadges = {};
    this.isLoading = true;

    this.productService.getProductsByCatalog(this.catalogId).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;

        for (let product of products) {
          this.carbonService.getCarbonScore(product.id).subscribe(res => {
            const badgeEnum = res.badge;
            this.carbonBadges[product.id] =
              badgeEnum === 0 ? 'undefined' :
              badgeEnum === 1 ? 'bas' :
              badgeEnum === 2 ? 'moyen' : 'eleve';
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits :', err);
        this.products = [];
        this.isLoading = false;
      }
    });
  }
}

  
  openProductDetailDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductdetailsComponent, {
      width: '500px',
      data: {
        product: product, 
            carbonScore: this.carbonBadges[product.id] || 'undefined' 
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Le modal a été fermé');
    });
  }
 openSimulateur(product: any): void {
  const clientId = Number(localStorage.getItem('clientId'));

  if (!clientId) {
    console.error('Client ID is missing!');
    return;
  }

  this.simulationService.trackUsage(product.id, clientId).subscribe({
    next: (response: any) => {
      const usageId = response.usage_id; 
      if (!usageId) {
        console.error('trackUsage did not return an ID');
        return;
      }

      const dialogRef = this.dialog.open(SimulateurComponent, {
        width: '95vw',
        maxWidth: '600px',
        data: {
          product,
          usageId
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Modal simulation fermé');
      });
    },
    error: err => {
      console.error('Erreur trackUsage', err);
    }
  });
}

  
  addToCart(productId: number): void {
      const clientId = Number(localStorage.getItem('clientId'));

    if (this.clientId) {

    this.productService.addToCart(this.clientId, productId).subscribe({
      next:() => {   
    this.productService.refreshCartCount(clientId);
            
        this.snackBar.open('Produit ajouté au panier avec succés', 'Fermer', {
  duration: 3000});

      },
      error: error => {
        console.error('Failed to add to cart', error);
        this.snackBar.open('Une erreur s^est produite lors de l^ajout au panier.', 'Fermer', {
  duration: 3000,
  panelClass: ['snackbar-error']
});
      }
    }); }
    else
    {  console.error('Client ID is missing!');}

  }

trackUsage(productId: any): void {
  const clientId = Number(localStorage.getItem('clientId'));
  this.simulationService.trackUsage(productId, clientId)
    .subscribe({
      next: (response) => {
        console.log('Tracked:', response);
      },
      error: (err) => {
        console.error('Tracking failed:', err);
      }
    });}
}
