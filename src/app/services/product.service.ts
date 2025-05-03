import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiProducts = 'http://localhost:8000/Product';
  private apiCatelogs = 'http://localhost:8000/api/catalog/all';

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

}
