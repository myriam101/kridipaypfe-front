import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { EnergybillService } from 'src/app/services/energybill.service';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-bonif-gam',
  templateUrl: './bonif-gam.component.html',
  styleUrls: ['./bonif-gam.component.css']
})
export class BonifGamComponent implements OnInit {
  bonifPoints: any[] = [];
  totalPoints: number = 0;
  clientId!: number;
  client: any;

  steps = [
    { threshold: 20, label: 'Départ' },
    { threshold: 50, label: 'Bronze' },
    { threshold: 100, label: 'Argent' },
    { threshold: 150, label: 'Or' },
    { threshold: 200, label: 'Platine' },
  ];
  maxThreshold: number = 200;

  constructor(
    private clientService: ClientService,
    private bonifpointService: PointsService
  ) {}

  ngOnInit(): void {
    this.clientId = Number(localStorage.getItem('clientId'));

    if (this.clientId) {
      this.clientService.getOneClient(this.clientId).subscribe({
        next: data => (this.client = data),
        error: err => console.error('Erreur chargement client', err)
      });

      this.loadPointsBonif(this.clientId);
    }
  }

  loadPointsBonif(clientId: number): void {
    this.bonifpointService.getClientBonifPoints(clientId).subscribe(res => {
      this.totalPoints = res.total_points;
      this.bonifPoints = res.details;
    });
  }

  getProgressPercentage(): number {
  const remainingPoints = this.getTotalRemainingPoints();
  return Math.min(100, Math.round((remainingPoints / this.maxThreshold) * 100));
}


  getTotalRemainingPoints(): number {
    return this.bonifPoints
      .filter(p => p.remainingPts && p.remainingPts > 0)
      .reduce((acc, p) => acc + p.remainingPts, 0);
  }

 getEncouragementMessage(): string {
  const remaining = this.getTotalRemainingPoints();

  if (remaining < 50) return '💪 Courage, tu y es presque !';
  if (remaining < 100) return '🥈 Continue, bientôt le badge Argent !';
  if (remaining < 150) return '🥇 Plus que quelques points pour le niveau Or !';
  if (remaining < 500) return '💎 Tu approches du niveau Platine !';
  
  return '🏆 Félicitations ! Tu as atteint le niveau maximum !';
}


  get currentLevel(): string {
  const remaining = this.getTotalRemainingPoints();
  const level = [...this.steps].reverse().find(s => remaining >= s.threshold);
  return level ? level.label : 'Débutant';
}


  get nextGoalLabel(): string {
  const remaining = this.getTotalRemainingPoints();
  const next = this.steps.find(s => remaining < s.threshold);
  return next ? next.label : 'Platine';
}

}
