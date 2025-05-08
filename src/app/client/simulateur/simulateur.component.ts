import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.component.html',
  styleUrls: ['./simulateur.component.css']
})
export class SimulateurComponent {
  dailyUsage: number = 1;
  usageHours: number = 0;
  usageMinutes: number = 0;

  constructor(
    public dialogRef: MatDialogRef<SimulateurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  simulate(): void {
    const totalMinutes = this.usageHours * 60 + this.usageMinutes;
    this.dialogRef.close({
      dailyUsage: this.dailyUsage,
      durationMinutes: totalMinutes
    });
  }
}
