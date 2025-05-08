import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private urlclients = 'http://localhost:8000/client';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlclients}/all`);
  }
  getClientInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.urlclients}/${userId}`);
  }
  getClientByEmail(email: string): Observable<any> {
    return this.http.get(`${this.urlclients}/email/${email}`);
  }
  
  }
