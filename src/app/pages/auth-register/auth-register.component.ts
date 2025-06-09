import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css']
})
export class AuthRegisterComponent  implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

 ngOnInit(): void {
  this.registerForm = this.fb.group(
    {
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      adress: [''],
      dateNaissance: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    },
    { validators: this.passwordMatchValidator }
  );
}

// Affiche ou masque le champ "adress"
showAdressField(): boolean {
  const role = this.registerForm.get('role')?.value;
  return role === 'client' || role === 'provider';
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

  if (this.showAdressField()) {
    payload.adress = formValue.adress;
  }

  if (formValue.role === 'client') {
    payload.dateNaissance = formValue.dateNaissance || '2000-01-01';
  }

  this.authService.registerUser(payload).subscribe({
    next: () => {
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Erreur lors de l’inscription.';
      this.isLoading = false;
    }
  });
}

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}


}
