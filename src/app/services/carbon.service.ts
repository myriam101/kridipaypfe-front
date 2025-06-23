import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  constructor(private http: HttpClient) { }
  private api = 'http://localhost:8000/';

  getCarbonScore(productId: number) {
    return this.http.get<{
      badge: number; score: number 
}>(`${this.api}carbon/${productId}`);
  }  
  setVisibilityByCatalog(catalogId: number, visible: number): Observable<any> {
    return this.http.post(`${this.api}carbon/set-visible/${catalogId}/${visible}`, {});
  }
  getCarbonVisibilityStatusByCatalog(catalogId: number): Observable<any> {
    return this.http.get(`${this.api}carbon/visible-status/${catalogId}`);
  }
  addCarbonImpact(productId: number, visible: boolean = true): Observable<any> {
  const body = { visible };
  return this.http.post(`${this.api}carbon/add/${productId}`, body, { responseType: 'text' });
}
  recalculateCarbonBadges(): Observable<any> {
    return this.http.put(`${this.api}carbon/recalculate`, null, { responseType: 'text' });
  }
    updateAllCarbonValues(): Observable<any> {
    return this.http.post(`${this.api}carbon/update-all-carbons`, {});
  }
  getCarbonImpactByProduct(productId: number): Observable<any> {
    return this.http.get<any>(`${this.api}carbon/simulate-by-product/${productId}`);
  }
/**facteur d emission co2/khw */
  getCurrentFacteur(): Observable<any> {
    return this.http.get(`${this.api}facteur/current`);
  }

  addOrUpdateFacteur(valeur: number): Observable<any> {
    return this.http.post(`${this.api}facteur/add-or-update`, { valeur });
  }

  
}
