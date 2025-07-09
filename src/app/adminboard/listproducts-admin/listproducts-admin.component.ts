import { ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { CarbonService } from 'src/app/services/carbon.service';
import { ProductService } from 'src/app/services/product.service';
import { VerificationComponent } from '../verification/verification.component';
import { MatDialog } from '@angular/material/dialog';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-listproducts-admin',
  templateUrl: './listproducts-admin.component.html',
  styleUrls: ['./listproducts-admin.component.css']
})
export class ListproductsAdminComponent implements OnInit, OnChanges {
  
  @Input() catalogId!: number;
  products: any[] = [];
   mismatches: any[] = [];

  carbonBadges: { [key: number]: string } = {};
  carbonVisible: boolean = true;
  catalogs: any[] = []; 
  isLoading :boolean= false;
  bootstrap: any;
  activeTooltipId: number | null = null;

  constructor(private catalogervice: CatalogService,
    private productService: ProductService,
    private carbonService: CarbonService,  private cdr: ChangeDetectorRef,private dialog:MatDialog

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
    this.catalogervice.getCatalogs().subscribe({
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
  
    this.productService.AdmingetProductsByCatalog(this.catalogId).subscribe({
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
   badgeEnum === 0 ? 'undefined' :
  badgeEnum === 1 ? 'low' :
  badgeEnum === 2 ? 'medium' : 'high';
  
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
  event.stopPropagation(); 
  this.activeTooltipId = this.activeTooltipId === productId ? null : productId;
}

@HostListener('document:click')
closeTooltip(): void {
  this.activeTooltipId = null;
}
getCarbonBadgeText(badge: string | undefined): string {
 if (!badge || badge.toLowerCase() === 'undefined') {
  return "L'impact environnemental de ce produit n'est pas défini en raison d'un manque de données.";
}
const val = badge.toLowerCase();
if (val === 'low') {
  return "Ce produit a un impact environnemental plutôt bas par rapport aux produits de sa catégorie.";
} else if (val === 'medium') {
  return "Ce produit a un impact environnemental moyen par rapport aux produits de sa catégorie.";
} else if (val === 'high') {
  return "Ce produit a un impact environnemental élevé par rapport aux produits de sa catégorie.";
} else {
  return "L'impact environnemental de ce produit n'est pas défini en raison d'un manque de données.";
}

}
openMismatchDialog(product: any): void {
  const verificationId = product.verification?.id;
  if (!verificationId) {
    console.warn('Pas d’ID de vérification disponible pour ce produit');
    return;
  }

  this.productService.markAsSeen(verificationId).subscribe({
    next: () => {
      console.log('Vérification marquée comme vue ');
      product.verification.seen = true; 
      


    },
    error: err => {
      console.error('Erreur lors de la mise à jour de "seen" ', err);
    }
  });

  this.dialog.open(VerificationComponent, {
    width: '500px',
    data: product
  });
}

}