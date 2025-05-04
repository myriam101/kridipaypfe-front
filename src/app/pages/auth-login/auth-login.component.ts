import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProviderService } from 'src/app/services/provider.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  providerId: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe(
      (response) => {
        const token = response.token;
        localStorage.setItem('token', token);

        const decodedToken: any = this.jwtHelper.decodeToken(token);
        const roles = decodedToken.roles || [];
        const userEmail = decodedToken.email;

        if (roles.includes('ROLE_PROVIDER')) {
          this.providerService.getProviderByEmail(userEmail).subscribe({
            next: (provider) => {
              this.providerId = provider.id;
              localStorage.setItem('providerId', this.providerId.toString());
              this.router.navigate(['/provider']);
            },
            error: (err) => {
              console.error('Erreur récupération ID provider', err);
              this.errorMessage = 'Erreur lors de la récupération du compte fournisseur.';
            }
          });
        } else if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/adminboard']);
        } else if (roles.includes('ROLE_CLIENT')) {
          this.router.navigate(['/client']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      (error) => {
        this.errorMessage = 'Identifiants incorrects !';
      }
    );
  }
}
