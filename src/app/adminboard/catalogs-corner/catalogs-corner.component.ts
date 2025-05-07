import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from 'src/app/services/catalog.service';
import { ProductService } from 'src/app/services/product.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-catalogs-corner',
  templateUrl: './catalogs-corner.component.html',
  styleUrls: ['./catalogs-corner.component.css'],
  encapsulation: ViewEncapsulation.None, // <--- Add this line

})
export class CatalogsCornerComponent {
catalogs: any[] = [];
  selectedCatalogId!: number;
  isSidebarOpen = false;
  providers: any[] = [];
selectedProviderId: number | null = null;

  constructor(private productService: ProductService,private router: Router, private route: ActivatedRoute,private providerservice: ProviderService,private catalogservice: CatalogService) {}

  ngOnInit(): void {
    this.loadProviders();
  }



loadProviders(): void {
  this.providerservice.getAllProviders().subscribe({
    next: (data) => this.providers = data,
    error: (err) => console.error('Error fetching providers', err)
  });
}

onProviderSelect(providerId: number): void {
  this.selectedProviderId = providerId;
  console.log("prov id",providerId);
  this.catalogservice.getCatalogsByProvider(providerId).subscribe({
    next: (data) => this.catalogs = data,
    error: (err) => console.error('Error fetching catalogs', err)
  });
}

onSelectCatalog(catalogId: number): void {
  this.selectedCatalogId = catalogId;
console.log("selected catalog id",catalogId);
}

}
