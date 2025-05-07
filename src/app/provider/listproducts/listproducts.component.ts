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
  catalogs: any[] = []; // Tableau pour stocker les catalogues disponibles
  isLoading :boolean= false;


  constructor(
    private productService: ProductService,
    private carbonService: CarbonService
  ) {}

  ngOnInit(): void {
    this.loadCatalogs(); // Charger les catalogues dès l'initialisation
  }

  ngOnChanges(): void {
    if (this.catalogId) {
      this.onCatalogChange(); // Vérifier la visibilité du carbone à chaque changement de catalogue
    }
  }

  loadCatalogs(): void {
    // Charger la liste des catalogues depuis l'API
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
      // Vérifier la visibilité pour le catalogue sélectionné
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
  
    this.isLoading = true; // lancement du chargement
  
    this.productService.getProductsByCatalog(this.catalogId).subscribe({
      next: (products) => {
        this.products = products;
        this.carbonBadges = {};
  
        if (products.length === 0) {
          this.isLoading = false; //Rien à charger
          return;
        }
  
        let loadedCount = 0;
        for (let product of products) {
          this.carbonService.getCarbonScore(product.id).subscribe({
            next: (res) => {
              const badgeEnum = res.badge;
              this.carbonBadges[product.id] =
                badgeEnum === 0 ? 'undefined' :
                badgeEnum === 1 ? 'low' :
                badgeEnum === 2 ? 'medium' :
                badgeEnum === 3 ? 'high' : '';
  
              loadedCount++;
              if (loadedCount === products.length) {
                this.isLoading = false; // Fin du chargement des scores
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
        this.isLoading = false; // Fin même en cas d’erreur
      }
    });
  }
  

  toggleCarbonVisibility(): void {
    if (!this.catalogId) return;
  
    this.carbonService.setVisibilityByCatalog(this.catalogId, this.carbonVisible ? 1 : 0).subscribe({
      next: () => {
        console.log('Visibilité carbone mise à jour pour le catalogue', this.catalogId);
        this.loadProducts(); // Recharger les produits après la mise à jour
      },
      error: (err) => {
        console.error('Erreur de mise à jour de visibilité carbone', err);
      }
    });
  }
}
