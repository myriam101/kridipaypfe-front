import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8000/category';

  constructor(private http: HttpClient) {}  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
  getDesignations() {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
