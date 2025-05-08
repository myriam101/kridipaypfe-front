import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CarbonService } from '../../services/carbon.service';
import { MatDialog } from '@angular/material/dialog'; // Importer MatDialog
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { SimulateurComponent } from '../simulateur/simulateur.component';
import { ClientService } from 'src/app/services/client.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnChanges,OnInit {
  @Input() catalogId!: number;
  products: any[] = [];
  isLoading :boolean= false;
  carbonBadges: { [key: number]: string } = {};  // This will hold the badge class based on score
  clientId: number | null = null;  // Variable to hold the client ID

  constructor(private productService: ProductService, private carbonService: CarbonService,private dialog: MatDialog,private clientService:ClientService) {}

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
              badgeEnum === 1 ? 'low' :
              badgeEnum === 2 ? 'medium' : 'high';
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
        product: product, // Passer le produit complet
        carbonScore: this.carbonBadges[product.id] || 'undefined' // Passer le score carbone ou 'undefined' s'il n'est pas défini
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Le modal a été fermé');
    });
  }
  openSimulateur(product: any): void {
    this.dialog.open(SimulateurComponent, {
      width: '95vw',
      maxWidth: '600px',
      panelClass: 'custom-dialog-container'

    });
  }
  
  addToCart(productId: number): void {
    if (this.clientId) {

    this.productService.addToCart(this.clientId, productId).subscribe({
      next: response => {
        alert('Product added to cart!');
        console.log(response);
      },
      error: error => {
        console.error('Failed to add to cart', error);
      }
    }); }
    else     {  console.error('Client ID is missing!');}

  }

}
