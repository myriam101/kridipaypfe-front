import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-progresscrapper',
  template: `
    <h1 mat-dialog-title style="color: #216490;">Mise à jour des tarifs</h1>

    <div mat-dialog-content class="dialog-content">
      <div class="steps-container">
        <div class="step" [class.active]="currentStep >= 1">
          <div class="circle">{{ currentStep > 1 ? '✓' : '1' }}</div>
          <div class="label">Extraction</div>
        </div>

        <div class="line" [class.active]="currentStep > 1"></div>

        <div class="step" [class.active]="currentStep >= 2">
          <div class="circle">{{ currentStep > 2 ? '✓' : '2' }}</div>
          <div class="label">JSON</div>
        </div>

        <div class="line" [class.active]="currentStep > 2"></div>

        <div class="step" [class.active]="currentStep >= 3">
          <div class="circle">{{ currentStep > 3 ? '✓' : '3' }}</div>
          <div class="label">Base données</div>
        </div>
      </div>

      <div class="message animate-message">{{ message }}</div>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="onClose()" *ngIf="canClose">Fermer</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
    }

    .dialog-content {
      background: #f8fbfd;
      padding: 1rem;
      border-radius: 8px;
    }

    .steps-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      flex-wrap: nowrap;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999;
      font-weight: 500;
      min-width: 60px;
      flex-shrink: 0;
      user-select: none;
    }

    .step.active {
      color: #216490;
    }

    .circle {
      width: 6vw;
      max-width: 40px;
      height: 6vw;
      max-height: 40px;
      border-radius: 50%;
      border: 3px solid #999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 0.4rem;
      background-color: white;
      color: #999;
      transition: all 0.3s ease;
    }

    .step.active .circle {
      background-color: #216490;
      color: white;
      border-color: #216490;
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(33, 100, 144, 0.5);
    }

    .label {
      font-size: 0.85rem;
      text-align: center;
    }

    .line {
      height: 3px;
      flex-grow: 1;
      max-width: 80px;
      background: #ccc;
      margin: 0 10px;
      border-radius: 2px;
      transition: background 0.3s ease;
    }

    .line.active {
      background: linear-gradient(to right, #216490, #59a3d3);
      box-shadow: 0 0 6px rgba(33, 100, 144, 0.4);
    }

    .message {
      font-size: 1rem;
      text-align: center;
      min-height: 2em;
      color: #216490;
      font-weight: 600;
      margin-top: 0.8rem;
      transition: opacity 0.3s ease;
    }

    .animate-message {
      animation: fadeInMessage 0.5s ease;
    }

    @keyframes fadeInMessage {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 400px) {
      .line {
        max-width: 40px;
        margin: 0 6px;
      }
      .circle {
        font-size: 1rem;
      }
      .label {
        font-size: 0.75rem;
      }
    }
  `]
})
export class ProgresscrapperComponent {
  message: string = '';
  canClose = false;
  currentStep = 1;

  constructor(
    public dialogRef: MatDialogRef<ProgresscrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message || '';
  }

  updateStep(step: number, msg: string) {
    this.currentStep = step;
    this.message = msg;
  }

  allowClose() {
    this.canClose = true;
  }

  onClose() {
    this.dialogRef.close();
  }
}
