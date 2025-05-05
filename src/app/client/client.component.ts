import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
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

  goToProfile() {
    this.router.navigate(['profile'], { relativeTo: this.route });
  }
  confirmLogout() {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      localStorage.removeItem('token'); 
      this.router.navigate(['/login']);
    }
  }
  
}
