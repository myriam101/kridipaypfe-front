import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient) { }
  private apiCarbon = 'http://localhost:8000/api/catalog';

getDesignationsByCatalog(catalogId: number): Observable<string[]> {
  return this.http.get<string[]>(`/${catalogId}/categories`);
}

}
