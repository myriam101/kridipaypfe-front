import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeuilService {

private baseUrl = 'http://localhost:8000/seuil';
private urlScore = 'http://localhost:8000/score';


  constructor(private http: HttpClient) {}
  
  getCurrentSeuil(): Observable<any> {
    return this.http.get(`${this.baseUrl}/current`);
  }

  addOrUpdateSeuil(valeur: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-or-update`, { valeur });
  }
   calculateAllScores(): Observable<any> {
    return this.http.post(`${this.urlScore}/calculate-all-scores`, {});
  }
}
