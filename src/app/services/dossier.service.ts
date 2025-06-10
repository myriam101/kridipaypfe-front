import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DossierService {

 private apiUrl = 'http://localhost:8000/dossier';
 private apiUrlBonif = 'http://localhost:8000/BonifPoint';

  constructor(private http: HttpClient) {}

  getDossiersByAgent(agentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/banque/${agentId}`);
  }  
  
 filterDossiersByBadge(payload: { ids: number[], badges: string[] }): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/filtrage-badge`, payload);
  }
   getProductImpactStats(agentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${agentId}/products-by-impact`);
  }
  getProductStatsByDossierId(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}/product-stats`);
}
validateDossier(dossierId: number): Observable<any> {
  
    return this.http.put(`${this.apiUrl}/validate/${dossierId}`, {});
}
/** methode ajout points au client*/ 
 addBonifPoints(dossierId: number): Observable<any> {
    return this.http.post(`${this.apiUrlBonif}/add/${dossierId}`, {});
  }

  // Méthode combinée qui cloture et ajoute les points
  validateAndAddPoints(dossierId: number): Observable<any> {
    return this.validateDossier(dossierId).pipe(
      switchMap(() => this.addBonifPoints(dossierId))
    );
  }
}
