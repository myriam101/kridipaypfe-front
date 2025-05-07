import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  constructor(private http: HttpClient) { }
  private apiCarbon = 'http://localhost:8000/carbon';

  getCarbonScore(productId: number) {
    return this.http.get<{
      badge: number; score: number 
}>(`${this.apiCarbon}/${productId}`);
  }  
  setVisibilityByCatalog(catalogId: number, visible: number): Observable<any> {
    return this.http.post(`${this.apiCarbon}/set-visible/${catalogId}/${visible}`, {});
  }
  getCarbonVisibilityStatusByCatalog(catalogId: number): Observable<any> {
    return this.http.get(`${this.apiCarbon}/visible-status/${catalogId}`);
  }
  
}
