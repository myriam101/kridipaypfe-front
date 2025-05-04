import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Catalog } from '../models/Catalog';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient) { }
  private catalogurl = 'http://localhost:8000/api/catalog';

getDesignationsByCatalog(catalogId: number): Observable<string[]> {
  return this.http.get<string[]>(`/${catalogId}/categories`);
}
getCatalogsByProvider(providerId: number): Observable<Catalog[]> {
  return this.http.get<Catalog[]>(`${this.catalogurl}/provider/${providerId}/catalogs`);
}

}
