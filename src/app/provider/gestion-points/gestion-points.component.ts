import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-gestion-points',
  templateUrl: './gestion-points.component.html',
  styleUrls: ['./gestion-points.component.css']
})
export class GestionPointsComponent implements OnInit {
  products: any[] = [];
  pagedProducts: any[] = [];
  isLoading=true;
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizes: number[] = [5, 10, 20];
  isVisible: boolean = true;

  providerId!: number;

  constructor(private productService: ProductService,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.providerId = Number(localStorage.getItem('providerId'));
    this.loadProducts();
  }

  loadProducts(): void {
      this.isLoading=true;
    this.productService.getProductsByProvider(this.providerId).subscribe({
      next: (data) => {
              this.isLoading=false;

        this.products = data;
        this.updatePagedProducts();
      },
      
      error: (err) => { console.error(err)
                      this.isLoading=false;

      }
      
    });
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  updatePagedProducts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.products.slice(start, end);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagedProducts();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedProducts();
    }
  }

toggleVisibility(product: any): void {
  this.productService.toggleBonifVisible(product.id).subscribe({
    next: (res) => {
      product.bonifvisible = res.bonifvisible;
    },
    error: (err) => {
      console.error('Erreur lors du changement de visibilité', err);
    }
  });
}
updatePoints(product: any): void {
  const newValue = Number(product.bonifpoint);
  if (isNaN(newValue) || newValue < 0) {
    alert('Veuillez entrer une valeur de points valide.');
    return;
  }

  this.productService.updateBonifPoints(product.id, newValue).subscribe({
    next: () => {
      console.log(`Points de bonification mis à jour : ${newValue}`);
       this.snackBar.open(`Points de bonification mis à jour : ${newValue}`, 'Fermer', {
  duration: 3000})
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour des points', err);
       this.snackBar.open('Erreur lors de la mise à jour des points', 'Fermer', {
  duration: 3000})
    }
  });
}

}
