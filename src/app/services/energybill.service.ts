import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalEnergyBill } from '../models/GlobalEnergyBill';

@Injectable({
  providedIn: 'root'
})
export class EnergybillService {


  private urlenergys = 'http://localhost:8000/';

  constructor(private http: HttpClient) {}
  getBillBySimulationId(simulationId: number): Observable<any> {
  return this.http.get<any>(`${this.urlenergys}EnergyBill/get/${simulationId}`);
}
calculateEnergyBill(id: number): Observable<any> {
    return this.http.post<any>(`${this.urlenergys}EnergyBill/calculate-bill/${id}`, {});
  }
 calculerFactures(simulationIds: number[]) {
  return this.http.post<any>(`${this.urlenergys}EnergyBill/calculate-bills`, {
    simulation_ids: simulationIds
  });
}

 
  downloadEnergyEstimationPdf(clientId: number) {
    return this.http.get(`${this.urlenergys}EnergyBill/${clientId}/energy-estimation-pdf`, {
      responseType: 'blob'
    });
  }


  getPdfAsBase64(billId: number): Observable<any> {
  return this.http.get<any>(`${this.urlenergys}EnergyBill/energy-estimation-pdf/${billId}`);
}

  cleanupEnergyEstimation(clientId: number): Observable<any> {
  return this.http.delete(`${this.urlenergys}EnergyBill/cleanup-energy-estimation/${clientId}`);
}
 getGlobalBillsByClientId(clientId: number): Observable<GlobalEnergyBill[]> {
  return this.http.get<GlobalEnergyBill[]>(`${this.urlenergys}globalenergybill/client/${clientId}`);
}

}
