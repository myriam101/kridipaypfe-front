import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Designation } from 'src/app/models/enum/designation';
import { EnergyClass } from 'src/app/models/enum/EnergyClass';
import { Typefeature } from 'src/app/models/enum/Typefeature';
import { CarbonService } from 'src/app/services/carbon.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-ajoutproduct',
  templateUrl: './ajoutproduct.component.html',
  styleUrls: ['./ajoutproduct.component.css']
})
export class AjoutproductComponent {
    @Output() productAdded = new EventEmitter<any>();

  successMessage: string = '';
  catalogs: any[] = [];
  productForm!: FormGroup;
  providerId!: number;
  selectedCatalogId: number | null = null;
  categories: Category[] = [];
  designationEnum = Designation;

  // Flags pour affichage des champs spécifiques
  isLaveLinge = false;
  isSecheLinge = false;
  isLavanteSechante = false;
  isRefrigerateur = false;
  isLaveVaisselle = false;
  isFour = false;
  isClimatiseur = false;
  isCaveVin = false;
  isCongelateur = false;
  isHotte = false;
  isTableCuisson = false;
  isAspirateur = false;
  isChauffage = false;
  isChauffeEau = false;
  isChaudiere = false;
  isTv = false;

  energyClasses = Object.values(EnergyClass);
  typefeatures = Object.values(Typefeature);

  constructor(private carbonServie:CarbonService,  public dialogRef: MatDialogRef<AjoutproductComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { CatalogId: any,Catalogname:any },
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryservice: CategoryService,
    private catalogService: CatalogService
  ) {}

  ngOnInit(): void {
    this.providerId = Number(localStorage.getItem('providerId'));
    this.categoryservice.getDesignations().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur chargement des catégories', err);
      }
    });
  
       
    this.initForm();
    
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      short_description: [''],
      reference: [''],
      brand: [''],
      category_id: [null],
      id_provider: [this.providerId],
      bonifvisible: [true],
      bonifpoint: [0],
      id_catalog: [this.data.CatalogId],
      features: this.fb.group({
        noise: [],
        weight: [],
        power: [],
        consumption_liter: [],
        consumption_watt: [],
        hdr_consumption: [],
        sdr_consumption: [],
        capacity: [],
        dimension: [],
        volume_refrigeration: [],
        volume_freezer: [],
        volume_collect: [],
        seer: [],
        scop: [],
        energy_class: [null],
        cycle_duration: [],
        nbr_couvert: [],
        nb_bottle: [],
        resolution: [],
        diagonal: [],
        condens_perform: [],
        spindry_class: [],
        steam_class: [],
        light_class: [],
        filtre_class: [],
        type: [],
        debit: []
      })
    });
  }

  onSelectCatalog(id: number) {
    this.data.CatalogId = id;
    this.productForm.patchValue({ id_catalog: id });
    console.log("selected catalog", id);
  }

 onSubmit(): void {
  if (this.productForm.valid) {
    const formValue = this.productForm.value;
    this.productService.addProduct(this.providerId, formValue).subscribe({
      next: (response: any) => {
        console.log('Produit + Feature ajoutés', response);
        this.successMessage = 'Produit ajouté avec succès !';

        // Appel au service Carbon après ajout du produit
        const newProductId = response.product_id; 
        if (newProductId) {
          this.carbonServie.addCarbonImpact(newProductId, true).subscribe({
            next: (res) => {
              console.log('Impact carbone ajouté:', res);
              this.carbonServie.recalculateCarbonBadges().subscribe({
                            next: (res) => {
                                            console.log('recalcul termine', res);

                            },
            error: (err) => {
              console.error('Erreur recalcul', err);
            }

              });
            },
            error: (err) => {
              console.error('Erreur ajout impact carbone:', err);
            }
          });
        }

        this.productForm.reset({
          id_provider: this.providerId,
          id_catalog: this.selectedCatalogId,
          bonifvisible: true,
          bonifpoint: 0
        });

        this.resetFlags();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur ajout', err);
      }
    });
  }
}


  getDesignationName(value: number): string {
    return this.designationEnum[value];
  }

  private resetFlags() {
    this.isLaveLinge = false;
    this.isSecheLinge = false;
    this.isLavanteSechante = false;
    this.isRefrigerateur = false;
    this.isLaveVaisselle = false;
    this.isFour = false;
    this.isClimatiseur = false;
    this.isCaveVin = false;
    this.isCongelateur = false;
    this.isHotte = false;
    this.isTableCuisson = false;
    this.isAspirateur = false;
    this.isChauffage = false;
    this.isChauffeEau = false;
    this.isChaudiere = false;
    this.isTv = false;
  }

  onDesignationChange(event: Event): void {
    this.resetFlags();

    const selectedId = Number((event.target as HTMLSelectElement).value);
    const selectedCategory = this.categories.find(cat => cat.id === selectedId);

    if (selectedCategory) {
      const designationText = this.getDesignationName(selectedCategory.designation);

      switch (designationText) {
        case 'LAVE_LINGE':
          this.isLaveLinge = true;
          break;
        case 'SECHE_LINGE':
          this.isSecheLinge = true;
          break;
        case 'LAVANTE_SECHANTE':
          this.isLavanteSechante = true;
          break;
        case 'REFRIGERATEUR':
          this.isRefrigerateur = true;
          break;
        case 'LAVE_VAISSELLE':
          this.isLaveVaisselle = true;
          break;
        case 'FOUR':
          this.isFour = true;
          break;
        case 'CLIMATISEUR':
          this.isClimatiseur = true;
          break;
        case 'CAVE_A_VIN':
          this.isCaveVin = true;
          break;
        case 'CONGELATEUR':
          this.isCongelateur = true;
          break;
        case 'HOTTE':
          this.isHotte = true;
          break;
        case 'TABLE_CUISSON':
          this.isTableCuisson = true;
          break;
        case 'ASPIRATEUR':
          this.isAspirateur = true;
          break;
        case 'CHAUFFAGE':
          this.isChauffage = true;
          break;
        case 'CHAUFFE_EAU':
          this.isChauffeEau = true;
          break;
        case 'CHAUDIERE':
          this.isChaudiere = true;
          break;
        case 'TV':
          this.isTv = true;
          break;
        default:
          break;
      }
    }
  }
}
