import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();
  
  private apiProducts = 'http://localhost:8000/Product';
  private apiCatelogs = 'http://localhost:8000/api/catalog/all';
private apiCart = 'http://localhost:8000/Cart'
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiProducts);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`/catalog/${this.apiProducts}?category=${categoryId}`);
  }
  getProductsByCatalog(catalogId: number): Observable<any> {
    return this.http.get(`http://localhost:8000/Product/catalog/${catalogId}/all`);
  }
  
  getCatalogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiCatelogs);
  }

getProductsByCatalogAndCategory(catalogId: number, categoryId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`http://localhost:8000/Product/catalog/${catalogId}/category/${categoryId}/all`);
}
addProduct(providerId: number, productData: any) {
  return this.http.post(`${this.apiProducts}/provider/${providerId}/add-product`, productData);
}

addToCart(clientId: number, productId: number): Observable<any> {
  const body = {
client_id: clientId,product_id: productId};
  return this.http.post(`${this.apiCart}/add`, body);
}
refreshCartCount(clientId: number): void {
  this.getCartCount(clientId).subscribe();
}

getCartCount(clientId: number): Observable<number> {
  return this.http.get<{ count: number }>(`${this.apiCart}/count/${clientId}`).pipe(
    map(response => response.count),
    tap(count => this.cartItemCount.next(count)) // met à jour le compteur
  );
}

getCartDetails(clientId: number) {
  return this.http.get(`${this.apiCart}/details/${clientId}`);
}
// Méthode pour supprimer un produit du panier
removeItemFromCart(clientId: number, productId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiCart}/${clientId}/remove/${productId}`);
}
getProductDetails(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiProducts}/product/${productId}`);
  }
getWaitingCarts(clientId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiCart}/client/non-pending-carts/${clientId}`).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        return of([]);
      }
      return throwError(() => error);
    })
  );
}
getAllWaitingCarts(providerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiCart}/waiting/${providerId}`);
  }
  getAllValidatedCarts(providerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiCart}/validated/${providerId}`);
  }
  getAllCancelledCarts(providerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiCart}/cancelled/${providerId}`);
  }
  
//with id provider
validateCart(cartId: number, providerId: number) {
  return this.http.put(`${this.apiCart}/validate/${cartId}`, {
    provider_id: providerId
  });
}
 cancelCart(cartId: number,providerId: number): Observable<any> {
  return this.http.put(`${this.apiCart}/cancel/${cartId}`, {
        provider_id: providerId

  });
}

validateCartByclient(clientId: number) {
    return this.http.patch(`${this.apiCart}/client/validate-all/${clientId}`, {});
  }
   getProductsByProvider(providerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiProducts}/${providerId}/products`);
  }
  toggleBonifVisible(productId: number) {
  return this.http.patch<any>(`${this.apiProducts}/toggle-bonifvisible/${productId}`, {});
}
updateBonifPoints(productId: number, bonifpoint: number) {
  return this.http.put(`${this.apiProducts}/update-bonif/${productId}`, {
    bonifpoint: bonifpoint
  }, { responseType: 'text' });
}
assignRandomPointsToProvider( selectedProductIds: number[]): Observable<any> {
  return this.http.post(`${this.apiProducts}/assign`, { productIds: selectedProductIds });
}

updateBonifs(): Observable<any> {
  return this.http.put(`${this.apiProducts}/update-bonifpoints`, {});
}

 // Vérifie l'état de validation du panier pour un provider donné
  checkProviderStatus(cartId: number, providerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiCart}/${cartId}/provider/${providerId}`);
  }

}
