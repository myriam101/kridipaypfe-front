import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutModalComponent } from '../pages/logout-modal/logout-modal.component';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.css']
})
export class AdminboardComponent {
  currentRoute: string = '';
isPackVisible: boolean = true; // visible par défaut

  constructor(private router: Router, private route: ActivatedRoute,private dialog: MatDialog) {
     this.router.events.subscribe(() => {
    this.currentRoute = this.router.url;
  });
  }

  ngOnInit() {
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

}