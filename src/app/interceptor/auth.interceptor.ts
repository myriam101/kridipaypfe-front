import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Liste des URLs à exclure
    const excludedUrls = [
      'http://localhost:8000/api/catalog/all',
      'http://localhost:8000/api/login_check'
    ];

    // Si l'URL de la requête est dans la liste, ne pas ajouter le token
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    if (isExcluded) {
      return next.handle(req);
    }

    // Sinon, cloner la requête et ajouter le header Authorization
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
