import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {



  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>('http://localhost:8000/api/login_check', credentials);
  }
  

  // Fonction pour enregistrer le token dans le localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

 
  logout() {
    localStorage.removeItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded.roles || [];
  }
  
}
