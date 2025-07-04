import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutModalComponent } from '../pages/logout-modal/logout-modal.component';
import { ProductInfo } from '../services/chatbot.service';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.css']
})
export class AdminboardComponent {
  currentRoute: string = '';
isPackVisible: boolean = true; 
  notificationCount: number = 0;
recentMismatches: any[] = [];
showNotifPanel: boolean = false;

  constructor(  private snackBar: MatSnackBar,
private verificationService: ProductService,private router: Router, private route: ActivatedRoute,private dialog: MatDialog) {
     this.router.events.subscribe(() => {
    this.currentRoute = this.router.url;
  });
  }

  ngOnInit() {
    this.verificationService.getMismatchCount().subscribe(res => {
    this.notificationCount = res.mismatchCount;
 if (this.notificationCount > 0) {
      this.snackBar.open(
        ` Vous avez ${this.notificationCount} produit${this.notificationCount > 1 ? 's' : ''} suspect${this.notificationCount > 1 ? 's' : ''} à vérifier.`,
        'Fermer',
        {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'        }
      );
    }
  });

  
    const toggleButton = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");
  
    if (toggleButton && wrapper) {
      toggleButton.addEventListener("click", () => {
        wrapper.classList.toggle("toggled");
      });
    }
}
  goToCatalogues() {
    this.router.navigate(['catalogues'], { relativeTo: this.route });
  }
  goToHome() {
    this.router.navigate(['home'], { relativeTo: this.route });
  }
  goToClients() {
    this.router.navigate(['clients'], { relativeTo: this.route });
  }
  
  goToConsole() {
    this.router.navigate(['console'], { relativeTo: this.route });
  }
  goToReglages() {
    this.router.navigate(['reglages'], { relativeTo: this.route });
  }
  goToPoints() {
    this.router.navigate(['pointsbonif'], { relativeTo: this.route });
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
  sidebarVisible: boolean = true;
 

toggleSidebar(): void {
  this.sidebarVisible = !this.sidebarVisible;
}
toggleNotificationPanel() {
  this.showNotifPanel = !this.showNotifPanel;
}
}