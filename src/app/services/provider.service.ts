import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {


  private apiurl = 'http://localhost:8000/Provider';

  constructor(private http: HttpClient) {}
  getProviderByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiurl}/email/${email}`);
  }
  getAllProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/all`);
  }
   getAllProviderUserNamesWithPoints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/all2`);
  }
  getPackPointsVisibility(providerId: number) {
    return this.http.get<{ id: number, visible: boolean }>(`${this.apiurl}/${providerId}/pack-points-visible`);
  }
 getProviderDetails(providerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/details/${providerId}`);
  }
  getProviderAdress(providerId: number): Observable<any> {
  return this.http.get<any>(`${this.apiurl}/${providerId}/adresse`);
}

}
