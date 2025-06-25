import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

private baseUrl = 'http://localhost:8000/Delivery/';

  constructor(private http: HttpClient) {}
    geocode(address: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/geocode`, { address });
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/osrm`, {
      lat1, lon1, lat2, lon2
    });
  }
  getProvidersForCart(cartId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}${cartId}/products-with-providers`);
}
createDelivery(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}add`, data);
}
private currentCartId: number | null = null;

  setCartId(id: number) {
    this.currentCartId = id;
  }

  getCartId(): number | null {
    return this.currentCartId;
  }
}
