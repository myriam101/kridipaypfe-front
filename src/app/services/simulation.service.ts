import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Simulation } from '../models/Simulation';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

 private apiUrl = 'http://localhost:8000/Simulation';

  constructor(private http: HttpClient) {}

  addSimulation(data: any): Observable<Simulation> {
    return this.http.post<Simulation>(`${this.apiUrl}/add-or-update`, data);
  }
envoyerSimulations(payload: any) {
  return this.http.post(`${this.apiUrl}/bulk`, payload);
}




}
