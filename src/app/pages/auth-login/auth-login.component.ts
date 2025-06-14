import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProviderService } from 'src/app/services/provider.service';
import { ClientService } from 'src/app/services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BanqueService } from 'src/app/services/banque.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
 isRegisterMode = false;
  banques: any[] = [];
  agences: any[] = [];
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  errorMessage = '';
  isLoading = false;
  providerId = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private providerService: ProviderService,
    private clientService: ClientService,
    private banqueService: BanqueService,
    private snackBar: MatSnackBar,
    
  ) {}

  ngOnInit(): void {
    this.initForms();
      this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'agent') {
        this.loadBanques();
      } else {
        this.banques = [];
        this.agences = [];
        this.registerForm.patchValue({ banque: '', agence: '' });
      }
    });

  this.registerForm.get('banque')?.valueChanges.subscribe((banqueId) => {
    console.log(' Banque sélectionnée ID =', banqueId);
    if (banqueId) {
      this.loadAgences(banqueId);
    } else {
      this.agences = [];
      this.registerForm.patchValue({ agence: '' });
    }
  });

  this.registerForm.get('agence')?.valueChanges.subscribe((agenceId) => {
    console.log('Agence sélectionnée ID =', agenceId);
  });
  }

  loadBanques(): void {
    this.banqueService.getBanques().subscribe((data) => {
      this.banques = data;
    });
  }

  loadAgences(banqueId: number): void {
    this.banqueService.getAgencesByBanque(banqueId).subscribe((data) => {
      this.agences = data;
    });
  
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        last_name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        banque: [''],
        agence: [''],
        adress: [''],
        dateNaissance: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['',[Validators.required,]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
  }

  showAdressField(): boolean {
    const role = this.registerForm.get('role')?.value;
    return role === 'client' || role === 'provider';
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit(): void {
    this.isRegisterMode ? this.onRegister() : this.onLogin();
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const formValue = this.registerForm.value;

    const payload: any = {
      name: formValue.name,
      last_name: formValue.last_name,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
     
    };
if (formValue.role === 'agent') {
  const banqueId = this.registerForm.get('banque')?.value;
  const agenceId = this.registerForm.get('agence')?.value;
  if (!banqueId || !agenceId) {
    alert('Veuillez sélectionner une banque et une agence.');
    return;
  }
  payload.banque = banqueId;
  payload.agence = agenceId;
}
    if (this.showAdressField()) {
      payload.adress = formValue.adress;
    }

    if (formValue.role === 'client') {
      payload.dateNaissance = formValue.dateNaissance || '2000-01-01';
    }

    this.authService.registerUser(payload).subscribe({
      next: () => {
        this.snackBar.open('Inscription réussie ! Connectez-vous.', 'Fermer', { duration: 3000 });
        this.toggleMode(); // retourne à login
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de l’inscription.';
        this.isLoading = false;
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('token', token);

        const decodedToken: any = this.jwtHelper.decodeToken(token);
        const roles = decodedToken.roles || [];
        const userEmail = decodedToken.email;

        if (roles.includes('ROLE_PROVIDER')) {
          this.providerService.getProviderByEmail(userEmail).subscribe({
            next: (provider) => {
              localStorage.setItem('providerId', provider.id);
              this.router.navigate(['/provider']);
              this.isLoading = false;
            },
            error: () => {
              this.errorMessage = 'Erreur lors de la récupération du compte fournisseur.';
              this.isLoading = false;
            }
          });
        } else if (roles.includes('ROLE_CLIENT')) {
          this.clientService.getClientByEmail(userEmail).subscribe({
            next: (res) => {
              localStorage.setItem('clientId', res.client_id);
              this.router.navigate(['/client']);
              this.isLoading = false;
            },
            error: () => {
              this.errorMessage = 'Erreur lors de la récupération du compte client.';
              this.isLoading = false;
            }
          });
        } else if (roles.includes('ROLE_AGENT')) {
          this.banqueService.getAgentByEmail(userEmail).subscribe({
            next: (res) => {
              localStorage.setItem('agentId', res.id);
              this.router.navigate(['/agence']);
              this.isLoading = false;
            },
            error: () => {
              this.errorMessage = 'Erreur lors de la récupération du compte agent.';
              this.isLoading = false;
            }
          });
        } else if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/adminboard/home']);
          this.isLoading = false;
        } else {
          this.router.navigate(['/unauthorized']);
          this.isLoading = false;
        }
      },
      error: (error) => {
        const msg =
          error.status === 401
            ? 'Email ou mot de passe incorrect.'
            : 'Une erreur est survenue. Veuillez réessayer.';
        this.snackBar.open(msg, 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.isLoading = false;
      }
    });
  }
showLoginForm = true; // ou false par défaut si tu veux afficher le formulaire d’inscription

toggleForm() {
  this.showLoginForm = !this.showLoginForm;
}

}
