import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CarbonService } from 'src/app/services/carbon.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-listproducts',
  templateUrl: './listproducts.component.html',
  styleUrls: ['./listproducts.component.css']
})
export class ListproductsComponent implements OnInit, OnChanges {
  @Input() catalogId!: number;
  products: any[] = [];
  carbonBadges: { [key: number]: string } = {};
  carbonVisible: boolean = true;

  constructor(
    private productService: ProductService,
    private carbonService: CarbonService
  ) {}

  ngOnInit(): void {
    this.carbonService.getCarbonVisibilityStatus().subscribe({
      next: (response) => {
        this.carbonVisible = response.visible;
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erreur de récupération du statut carbone', err);
      }
    });
  }

  ngOnChanges(): void {
    if (this.catalogId) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    if (!this.catalogId) return;

    this.productService.getProductsByCatalog(this.catalogId).subscribe({
      next: (products) => {
        this.products = products;
        this.carbonBadges = {};

        // Charger les scores carbone pour chaque produit
        for (let product of products) {
          this.carbonService.getCarbonScore(product.id).subscribe({
            next: (res) => {
              const badgeEnum = res.badge;
              switch (badgeEnum) {
                case 0:
                  this.carbonBadges[product.id] = 'undefined';
                  break;
                case 1:
                  this.carbonBadges[product.id] = 'low';
                  break;
                case 2:
                  this.carbonBadges[product.id] = 'medium';
                  break;
                case 3:
                  this.carbonBadges[product.id] = 'high';
                  break;
              }
            },
            error: (err) => {
              console.error(`Erreur score carbone du produit ${product.id}`, err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Erreur de chargement des produits', err);
      }
    });
  }

  toggleCarbonVisibility(): void {
    const action = this.carbonVisible
      ? this.carbonService.setAllCarbonVisibleToOne()
      : this.carbonService.setAllCarbonVisibleToZero();

    action.subscribe({
      next: () => {
        console.log('Visibilité carbone mise à jour');
        this.loadProducts(); // Recharge les produits pour refléter le nouveau statut
      },
      error: (err) => {
        console.error('Erreur lors du changement de visibilité carbone', err);
      }
    });
  }
}
