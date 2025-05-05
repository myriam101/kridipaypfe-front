import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent {
  showForm = false;
  constructor(private router: Router, private route: ActivatedRoute) {}

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
}