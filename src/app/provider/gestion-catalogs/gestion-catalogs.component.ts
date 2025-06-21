import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Catalog } from 'src/app/models/Catalog';
import { CatalogService } from 'src/app/services/catalog.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AjoutproductComponent } from '../ajoutproduct/ajoutproduct.component';

@Component({
  selector: 'app-gestion-catalogs',
  templateUrl: './gestion-catalogs.component.html',
  styleUrls: ['./gestion-catalogs.component.css']
})
export class GestionCatalogsComponent implements OnInit {
  isLoading :boolean= false;

    catalogs: Catalog[] = [];
    providerId!: number;
    selectedCatalogId!: number;
    catalogForm!: FormGroup;
    showForm = false;
    editingCatalogId: number | null = null;
    productCount$: { [catalogId: number]: Observable<number> } = {};
    catalogname: any;
    constructor(private dialog: MatDialog,private snackBar: MatSnackBar,private catalogService: CatalogService,private fb: FormBuilder) {}
  
    ngOnInit(): void {
      this.providerId = Number(localStorage.getItem('providerId'));
      this.catalog();
       this.catalogForm = this.fb.group({
        name: ['', Validators.required],
        public: [true]
      });
      
    }
    catalog(): void {
  this.providerId = Number(localStorage.getItem('providerId'));
  this.isLoading = true; 
  this.catalogService.getCatalogsByProvider(this.providerId).subscribe({
    next: (data) => {
          this.isLoading = false;
      this.catalogs = data.map((c: any) => ({
        ...c,
        createdat: new Date(c.createdat.date)
      }));

      this.catalogs.forEach(catalog => {
        this.productCount$[catalog.id] = this.catalogService.getProductCount(catalog.id);
      });
    },
    error: (err) => {
                this.isLoading = false;

      console.error('Erreur de récupération des catalogues', err);
    }
  });
}

getSelectedCatalog(catalog: any): void {
  this.selectedCatalogId = catalog.id;
  this.catalogname = catalog.name;
  console.log("ID du catalogue :", catalog.id);
  console.log("Nom du catalogue :", catalog.name);
}

    
 onSubmit(): void {
    if (this.catalogForm.valid) {
      this.catalogService.addCatalogToProvider(this.providerId, this.catalogForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Catalogue ajouté avec succès', 'Fermer', {
  duration: 3000});
          this.catalog();
          this.catalogForm.reset({ public: true });
        },
        error: (err) => console.error('Erreur ajout', err)
      });
    }
  }

toggleForm() {
  this.showForm = !this.showForm;
}
deleteCatalog(id: number) {
 const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.catalogService.deleteCatalog(id).subscribe({
      next: () => {
        this.snackBar.open('Catalogue supprimé avec succès', 'Fermer', { duration: 3000 });
        this.catalog(); 
      },
      error: (err) => {console.error('Erreur suppression', err)
        this.snackBar.open(err.error.message, 'Fermer', { duration: 4000 });

      }
    });
  }})
}
updateCatalog(catalogId: number): void {
  if (this.catalogForm.valid) {
    const updatedData = this.catalogForm.value;
    this.catalogService.updateCatalog(catalogId, updatedData).subscribe({
      next: () => {
        this.snackBar.open('Catalogue mis à jour', 'Fermer', { duration: 3000 });
        this.catalog();
        this.editingCatalogId = null; 
      },
      error: (err) => console.error('Erreur de modification', err)
    });
  }
}


editCatalog(catalog: Catalog): void {
  this.editingCatalogId = catalog.id;
  this.catalogForm.setValue({
    name: catalog.name,
    public: catalog.public
  });
}
cancelEdit(): void {
  this.editingCatalogId = null;
  this.catalogForm.reset();
}
 openAjoutProduit(catalog:any): void {
  this.getSelectedCatalog(catalog);
  const dialogRef = this.dialog.open(AjoutproductComponent, {
  width: '90vw',
  maxWidth: '700px',
  height: 'auto',
  maxHeight: '90vh',
  panelClass: 'custom-dialog-container',
        data: { CatalogId:this.selectedCatalogId,
        Catalogname:this.catalogname
       }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Le modal a été fermé');
      this.catalog()
    });
  }
}
