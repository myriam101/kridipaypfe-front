import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeuilBonifService {

  private apiUrl = 'http://localhost:8000/seuilBonif';

  constructor(private http: HttpClient) {}
  
  
  
   getSeuilsBonif(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`);
  }

  saveSeuilBonif(seuil: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-or-update`, seuil);
  }
}
