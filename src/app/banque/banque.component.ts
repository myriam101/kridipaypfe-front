import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BienvenuComponent } from './bienvenu/bienvenu.component';

@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.css']
})
export class BanqueComponent implements AfterViewInit {
currentRoute: string = '';

  constructor(private router: Router, private route: ActivatedRoute,private dialog: MatDialog) {
     this.router.events.subscribe(() => {
    this.currentRoute = this.router.url;
  });
  }
 ngAfterViewInit(): void {
    const welcomed = sessionStorage.getItem('agentWelcomed');

    if (!welcomed) {
      this.dialog.open(BienvenuComponent, {
        width: '500px',
        disableClose: true
      });
      sessionStorage.setItem('agentWelcomed', 'true');
    }
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
  goToHome() {
    this.router.navigate(['dashboard'], { relativeTo: this.route });
  }
  
  goToDemandes() {
    this.router.navigate(['demandes'], { relativeTo: this.route });
  }

  confirmLogout() {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      localStorage.removeItem('token'); 
      this.router.navigate(['/login']);
      sessionStorage.removeItem('agentWelcomed');

    }
  }
  sidebarVisible: boolean = true;

toggleSidebar(): void {
  this.sidebarVisible = !this.sidebarVisible;
}

}
