import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  catalogs: any[] = [];
  selectedCatalogId: number = 1;
  isSidebarOpen = false;

  @Output() catalogSelected = new EventEmitter<number>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCatalogs().subscribe((data) => {
      console.log("Catalogs reçus :", data);
      this.catalogs = data;
    });
  }

  onSelectCatalog(id: number) {
    this.catalogSelected.emit(id);
    this.selectedCatalogId = id;
    console.log("selected id",id);

  }
 


  onCatalogSelect(id: number) {
    this.selectedCatalogId = id;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


}
