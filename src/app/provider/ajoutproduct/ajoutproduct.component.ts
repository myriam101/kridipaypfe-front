import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Designation } from 'src/app/models/enum/designation';
import { EnergyClass } from 'src/app/models/enum/EnergyClass';
import { Typefeature } from 'src/app/models/enum/Typefeature';
import { CarbonService } from 'src/app/services/carbon.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SeuilBonifService } from 'src/app/services/seuil-bonif.service';

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
  isSubmitting = false;
  energyClasses = Object.values(EnergyClass);
  typefeatures = Object.values(Typefeature);
  imageUrls: any;
  selectedFiles: any;

  constructor(private snackBar: MatSnackBar,private carbonServie:CarbonService,  public dialogRef: MatDialogRef<AjoutproductComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { CatalogId: any,Catalogname:any },
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryservice: CategoryService,
    private catalogService: CatalogService,
    private seuilbonif:SeuilBonifService
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
        capacity: [],
        volume_refrigeration: [],
        volume_freezer: [],
        volume_collect: [],
        seer: [],
        scop: [],
        energy_class: [null],
        cycle_duration: [],
        nbr_couvert: [],
        nb_bottle: [],
        condens_perform: [],
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
    this.isSubmitting = true;

    const formValue = this.productForm.value;

    this.productService.addProduct(this.providerId, formValue).subscribe({
      next: (response: any) => {
        const newProductId = response.product_id;

        if (newProductId) {
          // 1. Ajout impact carbone
         // 1. Ajout impact carbone
this.carbonServie.addCarbonImpact(newProductId, true).subscribe({
  next: () => {
    this.carbonServie.recalculateCarbonBadges().subscribe({
      next: () => {
        //  Appel assign-seuil après recalcul des badges
        this.seuilbonif.assignSeuilToProduct(newProductId).subscribe({
          next: (seuilRes) => {
            console.log('Seuil assigné automatiquement:', seuilRes);
          },
          error: (err) => {
            console.error('Erreur assignation seuil:', err);
          }
        });
      },
      error: (err) => console.error('Erreur recalcul badges:', err)
    });
  },
  error: (err) => console.error('Erreur ajout impact carbone:', err)
});

          // 2. Upload des images
          if (this.selectedFiles && this.selectedFiles.length > 0) {
            this.productService.uploadProductImages(newProductId, this.selectedFiles).subscribe({
              next: res => {
                this.imageUrls = res.paths;
                console.log('Images uploadées :', res.paths);
              },
              error: err => {
                console.error('Erreur upload images :', err);
              }
            });
          }
        }

        // 3. Reset et feedback UI
        this.productForm.reset({
          id_provider: this.providerId,
          id_catalog: this.selectedCatalogId,
          bonifvisible: true,
          bonifpoint: 0
        });
        this.resetFlags();

        this.snackBar.open('Produit ajouté avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.productAdded.emit(response); 
        this.dialogRef.close(); 
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur ajout produit', err);
        this.isSubmitting = false;
        this.snackBar.open('Erreur lors de l’ajout du produit.', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
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
  }
private setFeatureValidatorsByDesignation(designation: string) {
  const featuresGroup = this.productForm.get('features') as FormGroup;

  // On reset d'abord tous les validators
  Object.keys(featuresGroup.controls).forEach(key => {
    featuresGroup.get(key)?.clearValidators();
    featuresGroup.get(key)?.updateValueAndValidity();
  });

  // Champs obligatoires de base pour toutes les catégories
  this.productForm.get('name')?.setValidators(Validators.required);
  this.productForm.get('brand')?.setValidators(Validators.required);
  this.productForm.get('reference')?.setValidators(Validators.required);
  this.productForm.get('category_id')?.setValidators(Validators.required);
  this.productForm.get('name')?.updateValueAndValidity();
  this.productForm.get('brand')?.updateValueAndValidity();
  this.productForm.get('reference')?.updateValueAndValidity();
  this.productForm.get('category_id')?.updateValueAndValidity();

  // Ajout des validators spécifiques par catégorie
  const required = Validators.required;
  const add = (key: string) => featuresGroup.get(key)?.setValidators(required);

  switch (designation) {

    case 'LAVE_VAISSELLE':
      add('consumption_watt');
      add('energy_class');
      add('nbr_couvert');
      add('noise');
      add('weight');
      break;

    case 'LAVE_LINGE':
    case 'LAVANTE_SECHANTE':
      add('capacity');
      add('cycle_duration');
      add('consumption_watt');
      add('energy_class');
      add('noise');
      add('weight');

      break;

    case 'REFRIGERATEUR':
    case 'CONGELATEUR':
      add('volume_freezer');
      add('consumption_watt');
      add('energy_class');
      add('weight');

      break;

    case 'SECHE_LINGE':
      add('noise');
      add('capacity');
      add('cycle_duration');
      add('consumption_watt');
      add('energy_class');
      add('weight');

      break;

    case 'CLIMATISEUR':
      add('consumption_watt');
      add('type');
      add('energy_class');
      add('weight');

      break;

    case 'FOUR':
    case 'HOTTE':
    case 'TABLE_CUISSON':
      add('consumption_watt');
      add('type');
      add('energy_class');
      add('weight');

      break;

    case 'CAVE_A_VIN':
      add('nb_bottle');
      add('noise');
      add('energy_class');
      add('weight');

      break;

    case 'ASPIRATEUR':
      add('consumption_watt');
      add('volume_collect');
      add('energy_class');
      add('weight');

      break;

    case 'CHAUFFAGE':
    case 'CHAUFFE_EAU':
    case 'CHAUDIERE':
      add('consumption_watt');
      add('debit');
      add('energy_class');
      add('weight');

      break;
     }

  // On met à jour tous les champs après ajout des validators
  Object.keys(featuresGroup.controls).forEach(key => {
    featuresGroup.get(key)?.updateValueAndValidity();
  });
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
        default:
          break;
      }
          this.setFeatureValidatorsByDesignation(designationText);

    }
  }
  isInvalid(controlName: string, groupName: string = ''): boolean {
  const control = groupName
    ? (this.productForm.get(groupName) as FormGroup).get(controlName)
    : this.productForm.get(controlName);

  return !!(control && control.invalid && (control.dirty || control.touched));
}
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  this.imageUrls = [];
  this.selectedFiles = Array.from(input.files);

  for (let file of this.selectedFiles) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

removeImage(index: number): void {
  this.imageUrls.splice(index, 1);
  this.selectedFiles.splice(index, 1);
}

}
