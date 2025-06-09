import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
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
  catalogs: any[] = []; 
  isLoading :boolean= false;
  bootstrap: any;
  activeTooltipId: number | null = null;

  constructor(
    private productService: ProductService,
    private carbonService: CarbonService
  ) {}
ngAfterViewInit(): void {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new this.bootstrap.Tooltip(tooltipTriggerEl));
}
  ngOnInit(): void {
    this.loadCatalogs();
  }

  ngOnChanges(): void {
    if (this.catalogId) {
      this.onCatalogChange(); 
    }
  }

  loadCatalogs(): void {
    this.productService.getCatalogs().subscribe({
      next: (response) => {

        this.catalogs = response;
        if (this.catalogId) {
          this.onCatalogChange(); 
        }
      },
      error: (err) => {
        console.error('Erreur de récupération des catalogues', err);
      }
    });
  }

  onCatalogChange(): void {
    if (this.catalogId) {
      this.carbonService.getCarbonVisibilityStatusByCatalog(this.catalogId).subscribe({
        next: (response) => {
          this.carbonVisible = response.visible;
          this.loadProducts(); 
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du statut carbone', err);
        }
      });
    }
  }
  loadProducts(): void {
    if (!this.catalogId) return;
  
    this.isLoading = true; 
  
    this.productService.getProductsByCatalog(this.catalogId).subscribe({
      next: (products) => {
        this.products = products;
        this.carbonBadges = {};
  
        if (products.length === 0) {
          this.isLoading = false; 
          return;
        }
  
        let loadedCount = 0;
        for (let product of products) {
          this.carbonService.getCarbonScore(product.id).subscribe({
           next: (res) => {
  const badgeEnum = res?.badge;

  this.carbonBadges[product.id] =
    badgeEnum === 1 ? 'bas' :
    badgeEnum === 2 ? 'moyen' :
    badgeEnum === 3 ? 'eleve' : 'undefined';

  
              loadedCount++;
              if (loadedCount === products.length) {
                this.isLoading = false; 
              }
            },
            error: (err) => {
              console.error(`Erreur score carbone produit ${product.id}`, err);
              loadedCount++;
              if (loadedCount === products.length) {
                this.isLoading = false;
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('Erreur de chargement des produits', err);
        this.isLoading = false; 
      }
    });
  }
  

  toggleCarbonVisibility(): void {
    if (!this.catalogId) return;
  
    this.carbonService.setVisibilityByCatalog(this.catalogId, this.carbonVisible ? 1 : 0).subscribe({
      next: () => {
        console.log('Visibilité carbone mise à jour pour le catalogue', this.catalogId);
        this.loadProducts(); 
      },
      error: (err) => {
        console.error('Erreur de mise à jour de visibilité carbone', err);
      }
    });
  }

toggleTooltip(productId: number, event: MouseEvent): void {
  event.stopPropagation(); // prevent clicks from bubbling
  this.activeTooltipId = this.activeTooltipId === productId ? null : productId;
}

@HostListener('document:click')
closeTooltip(): void {
  this.activeTooltipId = null;
}

}
