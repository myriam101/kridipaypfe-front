import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonifPalierBanqueService {
 

  private apiUrl = 'http://localhost:8000/palier';

  constructor(private http: HttpClient) {}  
  getBonifPaliersByAgent(agentId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${agentId}/banque`);
}
addBonifPalier(agentId: number, palierData: { minPoints: number; maxPoints: number; customInterestRate: number }): Observable<any> {
  return this.http.post(`${this.apiUrl}/add/${agentId}`, palierData);
}
deleteBonifPalier(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
updateBonifPalier(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  getPalierForDossier(dossierId: number) {
  return this.http.get<any>(`${this.apiUrl}/dossier/${dossierId}/palier`);
}

}
