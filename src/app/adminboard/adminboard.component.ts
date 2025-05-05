import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.css']
})
export class AdminboardComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

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

  confirmLogout() {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
      localStorage.removeItem('token'); // ou sessionStorage si utilisé
      this.router.navigate(['/login']);
    }
  }
}