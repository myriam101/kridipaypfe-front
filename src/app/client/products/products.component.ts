import { Component, Input, OnChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CarbonService } from '../../services/carbon.service';
import { MatDialog } from '@angular/material/dialog'; // Importer MatDialog
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { SimulateurComponent } from '../simulateur/simulateur.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnChanges {
  @Input() catalogId!: number;
  products: any[] = [];
  isLoading :boolean= false;
  carbonBadges: { [key: number]: string } = {};  // This will hold the badge class based on score

  constructor(private productService: ProductService, private carbonService: CarbonService,private dialog: MatDialog) {}
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
  
  

}
