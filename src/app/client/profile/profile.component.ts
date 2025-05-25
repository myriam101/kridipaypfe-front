import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalEnergyBill } from 'src/app/models/GlobalEnergyBill';
import { ClientService } from 'src/app/services/client.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
globalEnergyBills: GlobalEnergyBill[] = [];

client: any; 
clientId: number | null = null;  
waitingCarts: any[] = [];
cartLoadError: boolean=false;
billId: any;

constructor(private router: Router,private clientService: ClientService,private productservice: ProductService,private energybill: EnergybillService){}

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
    if (this.clientId) {
  this.energybill.getGlobalBillsByClientId(this.clientId).subscribe({
    next: (bills) => this.globalEnergyBills = bills,
    error: (err) => console.error('Erreur de chargement des factures :', err)
  });
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
});}

 downloadPdf(id:number) {
  this.billId=id;
    this.energybill.downloadEnergyEstimationPdfbyid(this.billId).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'estimation-facture.pdf';
      link.click();
    });
  }
}
