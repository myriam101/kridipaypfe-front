import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface WeightsByProvider {
  [providerName: string]: number; 
}

export interface CartWeightByProviderResponse {
  cart_id: number;
  weights_by_provider_kg: WeightsByProvider;

}
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private urlAPI = 'http://localhost:8000';

private baseUrl = 'http://localhost:8000/Delivery/';
  private cartWeight: number | null = null;
    private cartWeightsByProvider: WeightsByProvider | null = null;


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
// --- Nouvelle logique pour le poids par fournisseur ---

  setCartWeightsByProvider(weights: WeightsByProvider) {
    this.cartWeightsByProvider = weights;
  }

  getCartWeightsByProviderStored(): WeightsByProvider | null {
    return this.cartWeightsByProvider;
  }

  getCartWeightByProvider(cartId: number): Observable<CartWeightByProviderResponse> {
    return this.http.post<CartWeightByProviderResponse>(`${this.baseUrl}cart-weight-by-provider`, {
      cart_id: cartId
    });
  }
  
estimateCO2(weightKg: number, distanceKm: number) {
  return this.http.post<any>(`${this.urlAPI}/api/co2-estimate`, {
    weight: weightKg,
    distance: distanceKm
  });
}
getTotalCO2ByCart(cart_id: number) {
  return this.http.get<{ cart_id: number, total_co2_kg: number }>(
    `${this.baseUrl}total-co2/${cart_id}`
  );
}
getDeliveriesByProvider(providerId: number, validated: boolean): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}provider/${providerId}/all`, {
    params: { validated: validated.toString() }
  });
}
validateDelivery(deliveryId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}${deliveryId}/validate`, {});
}

}
