import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private urlAPI = 'http://localhost:8000';

private baseUrl = 'http://localhost:8000/Delivery/';
  private cartWeight: number | null = null;

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
 setCartWeight(weight: number) {
    this.cartWeight = weight;
  }

  getCartWeightStored(): number | null {
    return this.cartWeight;
  }

 
  getCartWeight(cartId: number) {
  return this.http.post<any>(`${this.baseUrl}cart-weight`, {
    cart_id: cartId
  });
}
estimateCO2(weightKg: number, distanceKm: number) {
  return this.http.post<any>(`${this.urlAPI}/api/co2-estimate`, {
    weight: weightKg,
    distance: distanceKm
  });
}
}
