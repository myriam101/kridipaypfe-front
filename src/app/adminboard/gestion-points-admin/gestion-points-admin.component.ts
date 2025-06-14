import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PointsService } from 'src/app/services/points.service';
import { ProviderService } from 'src/app/services/provider.service';
import { ConfirmDialogAdminComponent } from '../confirm-dialog-admin/confirm-dialog-admin.component';
import { DetailspointComponent } from './detailspoint/detailspoint.component';

@Component({
  selector: 'app-gestion-points-admin',
  templateUrl: './gestion-points-admin.component.html',
  styleUrls: ['./gestion-points-admin.component.css']
})
export class GestionPointsAdminComponent implements OnInit {
  providers: any[] = [];
  pagedProviders: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 5;
  pageSizes = [5, 10, 20];
  totalPages = 0;

  constructor(private providerService: ProviderService, private pointservice: PointsService,private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.fetchProviders();
  }

  fetchProviders(): void {
    this.isLoading = true;
    this.providerService.getAllProviderUserNamesWithPoints().subscribe({
      next: (data) => {
        this.providers = data;
        this.totalPages = Math.ceil(this.providers.length / this.pageSize);
        this.updatePagedProviders();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des providers', err);
        this.isLoading = false;
      },
    });
  }

  updatePagedProviders(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProviders = this.providers.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedProviders();
    }
  }

  onPageSizeChange(): void {
    this.totalPages = Math.ceil(this.providers.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedProviders();
  }

  toggleVisibility(provider: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogAdminComponent);
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
  this.pointservice.togglePackVisibility(provider.id_point).subscribe({
    next: (res) => {
      provider.points_visible = res.visible; 
    },
    error: (err) => {
      console.error('Erreur de changement de visibilité', err);
    }
  });}
})

  }
  voirProvider(providerId: number): void {
  const dialogRef = this.dialog.open(DetailspointComponent, {
    width: '80%',
    data: { providerId },
    autoFocus: false
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Le modal a été fermé');
  });
}

}