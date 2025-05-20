import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnergybillService {


  private urlenergys = 'http://localhost:8000/EnergyBill';

  constructor(private http: HttpClient) {}
  getBillBySimulationId(simulationId: number): Observable<any> {
  return this.http.get<any>(`${this.urlenergys}/get/${simulationId}`);
}
calculateEnergyBill(id: number): Observable<any> {
    return this.http.post<any>(`${this.urlenergys}/calculate-bill/${id}`, {});
  }
 calculerFactures(simulationIds: number[]) {
  return this.http.post<any>(`${this.urlenergys}/calculate-bills`, {
    simulation_ids: simulationIds
  });
}
}
