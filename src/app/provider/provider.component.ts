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
  
}