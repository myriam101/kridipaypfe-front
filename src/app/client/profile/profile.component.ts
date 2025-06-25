import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalEnergyBill } from 'src/app/models/GlobalEnergyBill';
import { ClientService } from 'src/app/services/client.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { PointsService } from 'src/app/services/points.service';
import { ProductService } from 'src/app/services/product.service';
import { PdfViewerFactureComponent } from './pdf-viewer-facture/pdf-viewer-facture.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
globalEnergyBills: GlobalEnergyBill[] = [];
bonifPoints: any[] = [];
loadingBills: { [billId: number]: boolean } = {};

client: any; 
clientId: any;  
waitingCarts: any[] = [];
cartLoadError: boolean=false;
billId: any;
totalPoints: number = 0;
currentFilter: 'actif' | 'utilise' = 'actif';
currentPage: number = 1;
itemsPerPage: number = 2;

constructor(private dialog: MatDialog,private router: Router,private clientService: ClientService,private productservice: ProductService,private energybill: EnergybillService,  private bonifpointService: PointsService){}

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
    this.loadEnergyBills(this.clientId);
    this.loadPointsBonif(this.clientId);
   }  
}
  loadPointsBonif(clientId: number) {
  this.bonifpointService.getClientBonifPoints(clientId).subscribe((res) => {
  this.totalPoints = res.total_points;
  this.bonifPoints = res.details;
});
}
  loadEnergyBills(clientId: number) {
 this.energybill.getGlobalBillsByClientId(clientId).subscribe({
    next: (bills) => this.globalEnergyBills = bills,
    error: (err) => console.error('Erreur de chargement des factures :', err)
  });
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
 downloadPdf(id: number) {
  this.loadingBills[id] = true;
  this.clientId = Number(localStorage.getItem('clientId'));

  this.energybill.getPdfAsBase64(id).subscribe({
    next: (res: any) => {
      const byteCharacters = atob(res.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Créer un blob PDF
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Créer une URL blob et simuler le clic pour télécharger
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = res.filename || 'estimation-facture-energie.pdf';
      link.click();

      window.URL.revokeObjectURL(url);

      this.energybill.cleanupEnergyEstimation(this.clientId).subscribe({
        next: () => {
          console.log('Données supprimées après export');
          this.loadEnergyBills(this.clientId);
          this.globalEnergyBills = this.globalEnergyBills.filter(bill => bill.id !== id);
          this.loadingBills[id] = false;
        },
        error: err => {
          console.error('Erreur suppression après export', err);
          this.loadingBills[id] = false;
        }
      });
    },
    error: err => {
      console.error('Erreur téléchargement PDF', err);
          this.loadingBills[id] = false;
    }
  });
}

  changePointFilter(type: 'actif' | 'utilise') {
  this.currentFilter = type;
  if (this.clientId) {
    this.bonifpointService.getBonifPointsByType(this.clientId, type).subscribe({
      next: (points) => {
        this.bonifPoints = points;
      },
      error: (err) => {
        console.error('Erreur chargement des points', err);
        this.bonifPoints = [];
      }
    });
  }
}
get paginatedCarts() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.waitingCarts.slice(start, start + this.itemsPerPage);
}

get totalPages() {
  return Math.ceil(this.waitingCarts.length / this.itemsPerPage);
}

goToPage(page: number) {
  this.currentPage = page;
}
previewPdf(billId: number) {
  this.dialog.open(PdfViewerFactureComponent, {
    width: '80vw',
    maxWidth: '900px',
    data: { billId }
  });
}
}
