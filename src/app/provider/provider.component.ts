import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent {
  showForm = false;
    isSubRoute = false;
    loading = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cache le header si ce n'est pas la route racine du fournisseur
        this.isSubRoute = !event.urlAfterRedirects.endsWith('/provider');
      }
    });
  }

  showAddProductForm() {
    this.showForm = true;
  }
  goToAddProduct() {
    this.router.navigate(['addproduct'], { relativeTo: this.route });
  }
  goToCatalog() {
    this.router.navigate(['catalog'], { relativeTo: this.route });
  }
  confirmLogout() {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      localStorage.removeItem('token'); 
      this.router.navigate(['/login']);
    }
  }
  
onActivate() {
  this.loading = true;
  // Simule un chargement court
  setTimeout(() => {
    this.loading = false;
  }, 500); // ajuste le temps selon tes besoins
}

onDeactivate() {
  this.loading = true;
}
}