import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';
import { AjoutproductComponent } from './ajoutproduct/ajoutproduct.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoutModalComponent } from '../pages/logout-modal/logout-modal.component';

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
  currentUser = { name: 'Admin' }; 
provider:any;
  isVisiblePoints: boolean = true; 
  providerId: any; 
  error: string | null = null;

  constructor(private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private providerService: ProviderService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit(): void {
    const toggleButton = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");
    if (toggleButton && wrapper) {
      toggleButton.addEventListener("click", () => {
        wrapper.classList.toggle("toggled");
      });
    }
    this.providerId = Number(localStorage.getItem('providerId'));
    // Charger la visibilité du pack de points
    this.providerService.getPackPointsVisibility(this.providerId).subscribe({
      next: res => this.isVisiblePoints = res.visible,
      error: err => {
        console.warn("Impossible de récupérer la visibilité du pack de points");
        this.isVisiblePoints = false;
      }
    });
    this.loadProviderDetails();
  }

  showAddProductForm() {
    this.showForm = true;
  }

  goToPoints() {
    this.router.navigate(['points'], { relativeTo: this.route });
  }

  goToGestionCatalogs() {
    this.router.navigate(['catalogues'], { relativeTo: this.route });
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
private loadProviderDetails(): void {
    this.providerId = Number(localStorage.getItem('providerId'));
    this.providerService.getProviderDetails(this.providerId).subscribe({
      next: (data) => {
        this.provider = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement du provider.';
      }
    });
  }
}
