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
  private apiPredict='http://localhost:8000/verif'
  private apiProducts = 'http://localhost:8000/Product';
private apiCart = 'http://localhost:8000/Cart'
  constructor(private http: HttpClient) {}

  
  getProductsByCatalog(catalogId: number): Observable<any> {
    return this.http.get(`${this.apiProducts}/catalog/${catalogId}/all`);
  }
  AdmingetProductsByCatalog(catalogId: number): Observable<any> {
    return this.http.get(`${this.apiProducts}/admin/catalog/${catalogId}/all`);
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
    tap(count => this.cartItemCount.next(count)) 
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
deleteProduct(id: number) {
  return this.http.delete<{ message: string }>(`${this.apiProducts}/delete/${id}`);
}
uploadProductImages(productId: number, files: File[]): Observable<any> {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images[]', file); // IMPORTANT : bien garder 'images[]'
  });

  return this.http.post(
    `${this.apiProducts}/${productId}/upload-images`,
    formData
  );
}
getProductImages(productId: number) {
  return this.http.get<{ images: { id: number, fileSrc: string }[] }>(`${this.apiProducts}/${productId}/images`);
}



 // Vérifie l'état de validation du panier pour un provider donné
  checkProviderStatus(cartId: number, providerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiCart}/${cartId}/provider/${providerId}`);
  }
   getMismatchCount() {
    return this.http.get<{ mismatchCount: number }>(`${this.apiPredict}/mismatch`);
  }
  markAsSeen(id: number): Observable<any> {
    return this.http.post(`${this.apiPredict}/${id}/seen`, {});
  }
  getMismatchSentences() {
    return this.http.get<any[]>(`${this.apiPredict}/products`);
  }
  
}
