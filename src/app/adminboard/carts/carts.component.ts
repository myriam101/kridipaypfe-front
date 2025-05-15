import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartsComponent  implements OnInit {
waitingCarts: any[] = [];
validCarts: any[] = [];
cancelledcarts: any[] = [];

  cartLoadError: boolean = false;
  isLoading: boolean = true;
  activeTab: string = 'waiting';

constructor(private cartService: ProductService) {}


ngOnInit(): void {
  this.getWaintingCarts();
  this.getCancelledCarts();
  this.getvalidatedCarts();
}

getWaintingCarts(): void {
  this.cartService.getAllWaitingCarts().subscribe({
    next: (data) => {
        this.waitingCarts = data;
        this.isLoading = false;
      },
      error: () => {
        this.cartLoadError = true;
        this.isLoading = false;
      }
  });
}
getvalidatedCarts(): void {
  this.cartService.getAllValidatedCarts().subscribe({
    next: (data) => {
        this.validCarts = data;
        this.isLoading = false;
      },
      error: () => {
        this.cartLoadError = true;
        this.isLoading = false;
      }
  });
}
getCancelledCarts(): void {
  this.cartService.getAllCancelledCarts().subscribe({
    next: (data) => {
        this.cancelledcarts = data;
        this.isLoading = false;
      },
      error: () => {
        this.cartLoadError = true;
        this.isLoading = false;
      }
  });
}

}
