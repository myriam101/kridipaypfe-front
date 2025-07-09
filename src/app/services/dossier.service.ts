import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { EcoFinancedStats, rabais } from '../banque/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DossierService {

 private apiDossier = 'http://localhost:8000/dossier';
 private apiUrlBonif = 'http://localhost:8000/BonifPoint';

  constructor(private http: HttpClient) {}

 getDossiersEncoursByAgent(agentId: number, badges: string[] = []): Observable<any> {
  let params = new HttpParams();

  // Ajouter chaque badge comme ?badges[]=...
  badges.forEach(badge => {
    params = params.append('badges[]', badge);
  });

  return this.http.get(`${this.apiDossier}/banque/encours/${agentId}`, { params });
}

 /*  getDossiersClotureByAgent(agentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/banque/cloture/${agentId}`);
  } */
  
   getProductImpactStats(agentId: number): Observable<any> {
    return this.http.get(`${this.apiDossier}/${agentId}/products-by-impact`);
  }
 
/** methode qui cloture le dossier */ 
validateDossier(dossierId: number): Observable<any> {
  
    return this.http.put(`${this.apiDossier}/validate/${dossierId}`, {});
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
  getEcoFinancedStats(agentId: number): Observable<EcoFinancedStats> {
    return this.http.get<EcoFinancedStats>(`${this.apiDossier}/${agentId}/eco-financed-stats`);
  }
   getRabaispourcentage(agentId: number): Observable<rabais> {
    return this.http.get<rabais>(`${this.apiDossier}/${agentId}/rabais-pourcentage`);
  }
}
