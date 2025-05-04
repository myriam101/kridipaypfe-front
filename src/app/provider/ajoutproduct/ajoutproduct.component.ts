import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Designation } from 'src/app/models/enum/designation';
import { EnergyClass } from 'src/app/models/enum/EnergyClass';
import { Typefeature } from 'src/app/models/enum/Typefeature';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-ajoutproduct',
  templateUrl: './ajoutproduct.component.html',
  styleUrls: ['./ajoutproduct.component.css']
})
export class AjoutproductComponent {
    successMessage: string = '';  // Variable pour afficher le message de succès

  catalogs: any[] = [];
  productForm!: FormGroup;
  providerId!: number;
  selectedCatalogId: number | null = null;
  categories: Category[] = [];
  designationEnum = Designation;

  // Variables pour gérer les champs spécifiques en fonction de la désignation
  isLaveLinge = false;
  isSecheLinge=false;
  isLavanteSechante=false;
  isRefrigerateur = false;
  isLaveVaisselle=false;
  isFour=false;
  isClimatiseur=false;
  isCaveVin=false;
  isCongelateur=false;
  isHotte=false;
  isTableCuisson=false;
  isAspirateur=false;
  isChauffage=false;
  isChauffeEau=false;
  isChaudiere=false;
  isTv=false;
  energyClasses = Object.values(EnergyClass);
  typefeatures = Object.values(Typefeature);

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
  category_id: [null],
  id_provider: this.providerId,
  bonifvisible: [true],
  bonifpoint: [0],
  id_catalog: this.selectedCatalogId,
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
    energy_class:[],
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
console.log("selected catalog",id);
  }
 
  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      this.productService.addProduct(this.providerId, formValue).subscribe({
        next: (response) => {
          console.log('Produit + Feature ajoutés', response);
          this.successMessage = 'Produit ajouté avec succès !'; // Afficher le message de succès
          this.productForm.reset(); // Réinitialiser le formulaire
        // Masquer le message après 5 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      
          // toast ou redirection
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
  // Gérer le changement de la désignation
  onDesignationChange(event: Event): void {
    const selectedId = Number((event.target as HTMLSelectElement).value);
    const selectedCategory = this.categories.find(cat => cat.id === selectedId);
    console.log("la desi",selectedCategory)
    if (selectedCategory) {
      const designationText = this.getDesignationName(selectedCategory.designation);
  
      //rendu selon la désignation
      this.isLaveLinge = designationText === 'LAVE_LINGE';
      this.isSecheLinge = designationText === 'SECHE_LINGE';
      this.isLavanteSechante = designationText === 'LAVANTE_SECHANTE';
      this.isRefrigerateur = designationText === 'REFRIGERATEUR';
      this.isLaveVaisselle = designationText === 'LAVE_VAISSELLE';
      this.isFour = designationText === 'FOUR';
      this.isClimatiseur = designationText === 'CLIMATISEUR';
      this.isCaveVin = designationText === 'CAVE_A_VIN';
      this.isCongelateur = designationText === 'CONGELATEUR';
      this.isHotte = designationText === 'HOTTE';
      this.isTableCuisson = designationText === 'TABLE_CUISSON';
      this.isAspirateur=designationText==='ASPIRATEUR';
      this.isChauffage = designationText === 'CHAUFFAGE';
      this.isChauffeEau = designationText === 'CHAUFFE_EAU';
      this.isChaudiere = designationText === 'CHAUDIERE';
      this.isTv = designationText === 'TV';
    
    }
  }
  
  
}
