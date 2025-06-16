import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface DeleteResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

 private apiUrlElect = 'http://localhost:8000/PriceElectricity';
 private apiUrlWater = 'http://localhost:8000/PriceWater';
 private apiScrapper = 'http://localhost:8000/scrapper'

  constructor(private http: HttpClient) {}

  addElectricityPrice(data: {price: number; sector: string; tranche_elect: string; }) {
    return this.http.post<any>(`${this.apiUrlElect}/add`, data);
  }
   addWaterPrice(data: {
    price: number;
    tranche_eau: string; 
  }) {
    return this.http.post<any>(`${this.apiUrlWater}/add`, data);
  }
   getAllElectricityPrices(sector?: string): Observable<any[]> {
  const url = sector ? `${this.apiUrlElect}/all?sector=${sector}` : `${this.apiUrlElect}/all`;
  return this.http.get<any[]>(url);
}

   getAllWaterPrices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlWater}/all`);
  }
  deleteWaterPrice(id: number) {
  return this.http.delete(`${this.apiUrlWater}/delete/${id}`);
}

deleteElectricityPrice(id: number) {
  return this.http.delete(`${this.apiUrlElect}/${id}`);
}
updateElectricityPrice(id: number, data: any): Observable<any> {
  return this.http.put(`${this.apiUrlElect}/edit/${id}`, data);
}

updateWaterPrice(id: number, data: any): Observable<any> {
  return this.http.put(`${this.apiUrlWater}/edit/${id}`, data);
}
checkWaterTranches() {
  return this.http.get<any>(`${this.apiUrlWater}/check`);
}

checkElectricityPrices() {
  return this.http.get<any>(`${this.apiUrlElect}/check`);
}
processTarifs(): Observable<any> {
    return this.http.post(`${this.apiScrapper}/tarif`, {}); 
  }
}
