import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {


  private apiurl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}
    getAgentByEmail(email: string): Observable<any> {
      return this.http.get(`${this.apiurl}/Agent/email/${email}`);
    }
    getAgentDetails(agentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/Agent/details/${agentId}`);
  }
  getBanques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/Banque/all`);
  }

  getAgencesByBanque(banqueId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/Agence/banque/${banqueId}`);
  }
}
