import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Catalog } from 'src/app/models/Catalog';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  catalogs: Catalog[] = [];
  providerId!: number;
  selectedCatalogId!: number;

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.providerId = Number(localStorage.getItem('providerId'));
    this.catalogService.getCatalogsByProvider(this.providerId).subscribe({
      next: (data) => {
        this.catalogs = data;
      },
      error: (err) => {
        console.error('Erreur de récupération des catalogues', err);
      }
    });
  }
  getSelectedCatalogName(): string {
    const selected = this.catalogs.find(c => c.id === +this.selectedCatalogId);
    console.log("id du cat",selected);
    return selected ? selected.name : '';
  }

}
