import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-catalog-display',
  templateUrl: './catalog-display.component.html',
  styleUrls: ['./catalog-display.component.css']
})
export class CatalogDisplayComponent {


 catalogs: any[] = [];
  selectedCatalogId!: number;
  isSidebarOpen = false;

  @Output() catalogSelected = new EventEmitter<number>();

  constructor(private productService: ProductService,private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productService.getCatalogs().subscribe((data) => {
      console.log("Catalogs reçus :", data);
      this.catalogs = data;
    });
  }
  onSelectCatalog(id: number): void {
 this.catalogSelected.emit(id);
    this.selectedCatalogId = id;
    console.log("selected catalog id",id);
  }
  
}
