import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ComparaisonComponent } from '../comparaison/comparaison.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoutModalComponent } from '../pages/logout-modal/logout-modal.component';

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

  constructor(private dialog: MatDialog,private modalService: MatDialog,private productService: ProductService,private router: Router, private route: ActivatedRoute,private clientservice : ClientService) {
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
    this.productService.refreshCartCount(+clientId); 
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
  const dialogRef = this.dialog.open(LogoutModalComponent, {
    width: '400px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      localStorage.removeItem('token'); 
      this.router.navigate(['/login']);
    }
  });
}
   openComparaisonDialog() {
    this.modalService.open(ComparaisonComponent, {
      width: '800px',
      data: {} 
    });
  }
}
