import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRoles = this.authService.getRoles();

    const hasRole = expectedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
