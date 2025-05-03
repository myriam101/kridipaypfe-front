import { Component, Input, OnChanges } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CarbonService } from '../services/carbon.service';
import { MatDialog } from '@angular/material/dialog'; // Importer MatDialog
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnChanges {
  @Input() catalogId!: number;
  products: any[] = [];
  carbonBadges: { [key: number]: string } = {};  // This will hold the badge class based on score

  constructor(private productService: ProductService, private carbonService: CarbonService,private dialog: MatDialog) {}

  ngOnChanges() {
    if (this.catalogId) {
      console.log(this.catalogId);
      this.productService.getProductsByCatalog(this.catalogId).subscribe(products => {
        this.products = products;

        // Charger les scores carbone pour chaque produit
        for (let product of products) {
          this.carbonService.getCarbonScore(product.id).subscribe(res => {
            const badgeEnum = res.badge;  // Badge value (0, 1, 2, 3)

            // Assign corresponding badge class based on the enum value
            if (badgeEnum === 0) {
              this.carbonBadges[product.id] = 'undefined';
            } else if (badgeEnum === 1) {
              this.carbonBadges[product.id] = 'low';
            } else if (badgeEnum === 2) {
              this.carbonBadges[product.id] = 'medium';
            } else if (badgeEnum === 3) {
              this.carbonBadges[product.id] = 'high';
            }
          });
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
  

}
