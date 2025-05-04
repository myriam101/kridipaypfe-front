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
  setAllCarbonVisibleToOne(): Observable<any> {
    return this.http.post(`${this.apiCarbon}/visible`, {});
  }

  setAllCarbonVisibleToZero(): Observable<any> {
    return this.http.post(`${this.apiCarbon}/notvisible`, {});
  }
  getCarbonVisibilityStatus(): Observable<{ visible: boolean }> {
    return this.http.get<{ visible: boolean }>(`${this.apiCarbon}/carbon/visible-status`);
  }
  
}
