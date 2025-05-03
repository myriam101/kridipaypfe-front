import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Designation } from 'src/app/models/enum/designation';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-ajoutproduct',
  templateUrl: './ajoutproduct.component.html',
  styleUrls: ['./ajoutproduct.component.css']
})
export class AjoutproductComponent {
  catalogs: any[] = [];
  productForm!: FormGroup;
  providerId!: number;
  selectedCatalogId: number | null = null;
  categories: Category[] = [];
  designationEnum = Designation;


  @Output() catalogSelected = new EventEmitter<number>();

  constructor( private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,private categoryservice:CategoryService) {}

  ngOnInit(): void {
    this.productService.getCatalogs().subscribe((data) => {
      console.log("Catalogs reçus :", data);
      this.catalogs = data;
    });
    this.providerId = Number(localStorage.getItem('providerId'));
console.log("povierid",this.providerId);
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      short_description: [''],
      reference: [''],
      brand: [''],
      bonifvisible: [true],
      category_id: [null],
      id_provider:this.providerId
    });
    this.categoryservice.getDesignations().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur chargement des catégories', err);
      }
    });
  }

  onSelectCatalog(id: number) {
    this.catalogSelected.emit(id);
    this.selectedCatalogId = id;

  }
 
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.addProduct(this.providerId, this.productForm.value).subscribe({
        next: (response) => {
          console.log('Produit ajouté', response);

          // éventuellement afficher un toast ou rediriger
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout', err);

        }
      });
    }
  }
  getDesignationName(value: number): string {
    return this.designationEnum[value];
  }
}
