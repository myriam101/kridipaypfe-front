import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimulatorUsageService {
 private apiUrl = 'http://localhost:8000/simulatorusage';

  constructor(private http: HttpClient) {}
  // 1. Track usage call
  trackUsage(productId: number, clientId: number) {
    return this.http.post(`${this.apiUrl}/track/${productId}/${clientId}`, {});
  }

  // 2. Update withSimulation call
  setWithSimulation(usageId: number) {
    const url = `${this.apiUrl}/${usageId}/set-with-simulation`;
    return this.http.post(url, {});
  }
    getGlobalStats() {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
