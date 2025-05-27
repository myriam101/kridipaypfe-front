import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalEnergyBill } from '../models/GlobalEnergyBill';

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

 
  downloadEnergyEstimationPdf(clientId: number) {
    return this.http.get(`${this.urlenergys}/${clientId}/energy-estimation-pdf`, {
      responseType: 'blob'
    });
  }
  getGlobalBillsByClientId(clientId: number): Observable<GlobalEnergyBill[]> {
  return this.http.get<GlobalEnergyBill[]>(`http://localhost:8000/globalenergybill/client/${clientId}`);
}
 downloadEnergyEstimationPdfbyid(billId: number) {
    return this.http.get(`${this.urlenergys}/energy-estimation-pdf/${billId}`, {
      responseType: 'blob'
    });
  }
  cleanupEnergyEstimation(clientId: number): Observable<any> {
  return this.http.delete(`${this.urlenergys}/cleanup-energy-estimation/${clientId}`);
}

}
