import { ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';
import { CarbonService } from 'src/app/services/carbon.service';
import { CatalogService } from 'src/app/services/catalog.service';
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
feedbackMessage: string | null = null;
feedbackType: 'success' | 'error' | null = null;
productsWithImages: any[] = [];

  constructor(private dialog:MatDialog, private catalogervice: CatalogService,
    private productService: ProductService,
    private carbonService: CarbonService,  private cdr: ChangeDetectorRef,  private snackBar: MatSnackBar

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

  this.productService.getProductsByCatalog(this.catalogId).subscribe({
    next: (products) => {
this.products = products.map((p: any) => ({ ...p, currentImageIndex: 0, images: [] }));
      this.carbonBadges = {};

      if (products.length === 0) {
        this.isLoading = false;
        return;
      }

      let loadedCount = 0;

      for (let product of this.products) {
        // Charger les images du produit
        this.productService.getProductImages(product.id).subscribe({
          next: (res) => {
product.images = res.images.map((img: any) => 'http://localhost:8000' + img.fileSrc.replace(/^\/?uploads?/, '/uploads/'));
            loadedCount++;
            if (loadedCount === products.length) {
              this.isLoading = false;
            }
          },
          error: () => {
            product.images = [];
            loadedCount++;
            if (loadedCount === products.length) {
              this.isLoading = false;
            }
          }
        });

        // Charger le badge carbone
        this.carbonService.getCarbonScore(product.id).subscribe({
          next: (res) => {
            const badgeEnum = res?.badge;
            this.carbonBadges[product.id] =
              badgeEnum === 0 ? 'undefined' :
              badgeEnum === 1 ? 'low' :
              badgeEnum === 2 ? 'medium' : 'high';
          },
          error: (err) => {
            console.error(`Erreur score carbone produit ${product.id}`, err);
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
prevImage(product: any, event: MouseEvent): void {
  event.stopPropagation();
  console.log('prevImage clicked for product', product.id);
  if (!product.images || product.images.length <= 1) return;

  product.currentImageIndex =
    (product.currentImageIndex - 1 + product.images.length) % product.images.length;
}

nextImage(product: any, event: MouseEvent): void {
  event.stopPropagation();
  console.log('nextImage clicked for product', product.id);
  if (!product.images || product.images.length <= 1) return;

  product.currentImageIndex =
    (product.currentImageIndex + 1) % product.images.length;
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
deleteProduct(id: number): void {
  const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '350px',
    data: {
      message: 'Voulez-vous vraiment supprimer définitivement ce produit ?'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return; // utilisateur a annulé

    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        this.carbonService.recalculateCarbonBadges().subscribe({
          next: () => {
            this.snackBar.open(res.message + ' - Badges carbone mis à jour.', 'Fermer', {
              duration: 4000,
              panelClass: ['snackbar-success']
            });
            this.loadProducts();
          },
          error: () => {
            this.snackBar.open(res.message + ' - Recalcul des badges échoué.', 'Fermer', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
            this.loadProducts();
          }
        });
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur lors de la suppression.';
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  });
}




}