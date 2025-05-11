import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();
  
  private apiProducts = 'http://localhost:8000/Product';
  private apiCatelogs = 'http://localhost:8000/api/catalog/all';
private apiCart = 'http://localhost:8000/Product/cart'
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
  return this.http.get<{ count: number }>(`${this.apiProducts}/cart/count/${clientId}`).pipe(
    map(response => response.count),
    tap(count => this.cartItemCount.next(count)) // met à jour le compteur
  );
}

getCartDetails(clientId: number) {
  return this.http.get(`${this.apiCart}/details/${clientId}`);
}
// Méthode pour supprimer un produit du panier (si besoin)
removeItemFromCart(clientId: number, productId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiCart}/${clientId}/remove/${productId}`);
}
getProductDetails(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiProducts}/product/${productId}`);
  }
}
