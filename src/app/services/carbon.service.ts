import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  
}
