import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

 private apiUrlElect = 'http://localhost:8000/PriceElectricity';
 private apiUrlWater = 'http://localhost:8000/PriceWater';

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
}
