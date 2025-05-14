import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProviderService } from 'src/app/services/provider.service';
import { ClientService } from 'src/app/services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  providerId: number = 0;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private providerService: ProviderService,
    private clientService: ClientService,  private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

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
              localStorage.setItem('providerId', provider.id);
              this.isLoading = false;
              this.router.navigate(['/provider']);
            },
            error: (err) => {
              console.error('Erreur récupération ID provider', err);
              this.errorMessage = 'Erreur lors de la récupération du compte fournisseur.';
              this.isLoading = false;
            }
          });
        } else if (roles.includes('ROLE_ADMIN')) {
          this.isLoading = false;
          this.router.navigate(['/adminboard/home']);
        } else if (roles.includes('ROLE_CLIENT')) {
          this.clientService.getClientByEmail(userEmail).subscribe({
            next: (res) => {
              localStorage.setItem('clientId', res.client_id);
              this.isLoading = false;
              this.router.navigate(['/client']);
            },
            error: (err) => {
              console.error('Erreur récupération ID client', err);
              this.errorMessage = 'Erreur lors de la récupération du compte client.';
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
          this.router.navigate(['/unauthorized']);
        }
      },
      (error) => {
  if (error.status === 401) {
this.snackBar.open('Email ou mot de passe incorrect.', 'Fermer', {
  duration: 3000,
  panelClass: ['snackbar-error']
});
  } else {
    this.snackBar.open('Une erreur est survenue. Veuillez réessayer.', 'Fermer', {
  duration: 3000,
  panelClass: ['snackbar-error']
});
  }
  this.isLoading = false;
}

    );
  }
}
