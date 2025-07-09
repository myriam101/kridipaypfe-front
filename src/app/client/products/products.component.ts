import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CarbonService } from '../../services/carbon.service';
import { MatDialog } from '@angular/material/dialog'; 
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { SimulateurComponent } from '../simulateur/simulateur.component';
import { ClientService } from 'src/app/services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimulatorUsageService } from 'src/app/services/simulator-usage.service';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],

  
})

export class ProductsComponent implements OnChanges,OnInit {
  @Input() catalogId!: number;
  products: any[] = [];
  isLoading :boolean= false;
  carbonBadges: { [key: number]: string } = {}; 
  clientId: number | null = null;  
    activeCarbonTooltipId: number | null = null;
tooltipPosition = { top: 0, left: 0 };

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
        this.products = products.map((p: any) => ({ ...p, currentImageIndex: 0, images: [] }));
        this.carbonBadges = {};

      if (products.length === 0) {
        this.isLoading = false;
        return;
      }
      let loadedCount = 0;

        for (let product of this.products) {
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
        width: '80vw',
        maxWidth: '500px',
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
     this.snackBar.open("Une erreur s'est produite lors de l'ajout au panier.", 'Fermer', {
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


toggleCarbonTooltip(productId: number, event: MouseEvent) {
  if (this.activeCarbonTooltipId === productId) {
    this.activeCarbonTooltipId = null;
  } else {
    this.activeCarbonTooltipId = productId;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.tooltipPosition.top = rect.top - 45; // un peu au-dessus
    this.tooltipPosition.left = rect.left + rect.width / 2 - 120; // centré (tooltip max-width: 240px)
  }
}

closeCarbonTooltip() {
  this.activeCarbonTooltipId = null;
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

prevImage(product: any, event: MouseEvent): void {
  event.stopPropagation();
  if (!product.images || product.images.length <= 1) return;

  product.currentImageIndex =
    (product.currentImageIndex - 1 + product.images.length) % product.images.length;
}

nextImage(product: any, event: MouseEvent): void {
  event.stopPropagation();
  if (!product.images || product.images.length <= 1) return;

  product.currentImageIndex =
    (product.currentImageIndex + 1) % product.images.length;
}

}
