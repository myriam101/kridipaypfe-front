import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  catalogs: any[] = [];
  selectedCatalogId!: number;
  isSidebarOpen = false;
  clientId!: number;
  cartItemCount: number=0;
  currentRoute: string = '';

  
  @Output() catalogSelected = new EventEmitter<number>();

  constructor(private productService: ProductService,private router: Router, private route: ActivatedRoute,private clientservice : ClientService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  ngOnInit(): void {
    const clientId = Number(localStorage.getItem('clientId'));
  this.productService.getCartCount(clientId).subscribe(count => {
    this.cartItemCount = count;
  });
    this.productService.getCatalogs().subscribe((data) => {
      console.log("Catalogs reçus :", data);
      this.catalogs = data;
    });
  if (clientId) {
    this.productService.refreshCartCount(+clientId); // charge au démarrage
    this.productService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }
  }

  onSelectCatalog(id: number) {
    this.catalogSelected.emit(id);
    this.selectedCatalogId = id;
    console.log("selected id",id);

  }
 
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goToProfile() {
    this.router.navigate(['profile'], { relativeTo: this.route });
  }
  opencart() {
    this.router.navigate(['shopping-cart'], { relativeTo: this.route });
  }
  confirmLogout() {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      localStorage.removeItem('token'); 
      this.router.navigate(['/login']);
    }
  }
}
