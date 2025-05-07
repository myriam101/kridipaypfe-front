import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private urlclients = 'http://localhost:8000/client';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlclients}/all`);
  }
  }
