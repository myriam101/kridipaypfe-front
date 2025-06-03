import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
 addCatalogToProvider(providerId: number, catalogData: any) {
    return this.http.post(`${this.catalogurl}/provider/${providerId}`, catalogData);
  }
  deleteCatalog(id: number) {
  return this.http.delete(`${this.catalogurl}/${id}`);
}
updateCatalog(id: number, data: any) {
  return this.http.put(`${this.catalogurl}/edit/${id}`, data);
}
getProductCount(catalogId: number): Observable<number> {
  return this.http.get<{productCount: number}>(`${this.catalogurl}/${catalogId}/product-count`)
    .pipe(map(res => res.productCount));
}

}
