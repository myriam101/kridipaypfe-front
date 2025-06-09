import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  showForm = false;
  isSubRoute = false;
  loading = false;
  currentRoute: string = '';
  sidebarVisible: boolean = true;

  isVisiblePoints: boolean = true; // valeur par défaut
  providerId: number = 1; // ⚠️ À adapter selon l'utilisateur connecté

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private providerService: ProviderService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit(): void {
    // toggle sidebar bouton
    const toggleButton = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");
    if (toggleButton && wrapper) {
      toggleButton.addEventListener("click", () => {
        wrapper.classList.toggle("toggled");
      });
    }

    // Charger la visibilité du pack de points
    this.providerService.getPackPointsVisibility(this.providerId).subscribe({
      next: res => this.isVisiblePoints = res.visible,
      error: err => {
        console.warn("Impossible de récupérer la visibilité du pack de points");
        this.isVisiblePoints = false;
      }
    });
  }

  showAddProductForm() {
    this.showForm = true;
  }

  goToAddProduct() {
    this.router.navigate(['addproduct'], { relativeTo: this.route });
  }

  goToPoints() {
    this.router.navigate(['points'], { relativeTo: this.route });
  }

  goToGestionCatalogs() {
    this.router.navigate(['catalogues'], { relativeTo: this.route });
  }

  goToProfile() {
    this.router.navigate(['profile'], { relativeTo: this.route });
  }

  goToCarts() {
    this.router.navigate(['commandes'], { relativeTo: this.route });
  }

  goToHome() {
    this.router.navigate(['home'], { relativeTo: this.route });
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
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
    setTimeout(() => {
      this.loading = false;
    }, 500); 
  }

  onDeactivate() {
    this.loading = true;
  }
  handlePointsNavigation() {
  if (this.isVisiblePoints) {
    this.router.navigate(['points'], { relativeTo: this.route });
  } else {
    this.router.navigate(['unauthorized'], { relativeTo: this.route });
  }
}

}
