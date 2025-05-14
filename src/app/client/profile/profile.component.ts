import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

client: any; 
clientId: number | null = null;  
  waitingCarts: any[] = [];
  cartLoadError: boolean=false;


constructor(private router: Router,private clientService: ClientService,private productservice: ProductService){}

closeProfile() {
  this.router.navigate(['/client']);
}


  ngOnInit(): void {
    this.clientId = Number(localStorage.getItem('clientId'));
    this.clientService.getOneClient(this.clientId).subscribe({
      next: data => {
        this.client = data;
      },
      error: err => {
        console.error('Erreur chargement client', err);
      }
    });
     if (this.clientId) {
      this.loadWaitingCarts(this.clientId);
    }
  }
  loadWaitingCarts(clientId: number) {
   this.productservice.getWaitingCarts(clientId).subscribe({
  next: (carts) => {
    this.waitingCarts = carts;
    this.cartLoadError = false;
  },
  error: (err) => {
    console.error('Erreur lors du chargement des paniers :', err);
    this.cartLoadError = true;
  }
});

  }
}
