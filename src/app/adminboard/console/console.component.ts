import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsoleService } from 'src/app/services/console.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {
  priceForm!: FormGroup;
  priceWaterForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private priceService: ConsoleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.priceForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      sector: ['', Validators.required],
      tranche_elect: ['', Validators.required]
    });
    // Formulaire eau
    this.priceWaterForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      tranche_eau: ['', Validators.required]
    });
  }

  showSnackBar(message: string, duration = 3000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  submitPrice() {
    if (this.priceForm.invalid) {
      this.priceForm.markAllAsTouched(); // Pour afficher les erreurs
      return;
    }

    const data = this.priceForm.value;
        this.isLoading = true;

    this.priceService.addElectricityPrice(data).subscribe({
      next: (res) => {
        this.showSnackBar(res.message || 'Tarif ajouté avec succès !');
        this.isLoading = false;

      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur inconnue';
        this.showSnackBar(errorMessage, 5000);
                      this.isLoading = false;
      }
    });
  }
   submitWaterPrice() {
    if (this.priceWaterForm.invalid) {
      this.priceWaterForm.markAllAsTouched();
      return;
    }

    const data = this.priceWaterForm.value;
        this.isLoading = true;

    this.priceService.addWaterPrice(data).subscribe({
      next: (res) => {
        this.showSnackBar(res.message || 'Tarif eau ajouté avec succès !');
                      this.isLoading = false;

      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Erreur inconnue';
        this.showSnackBar(errorMessage, 5000);
                      this.isLoading = false;

      }
    });
  }
}
