import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BanqueService } from 'src/app/services/banque.service';
import { DossierService } from 'src/app/services/dossier.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  agent: any;
  agentId: any;
  isLoading = true;
  error: string | null = null;

radarChartLabels: string[] = ['Non défini', 'Faible', 'Moyen', 'Élevé'];
  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: this.radarChartLabels,
    datasets: [
      {
        backgroundColor: 'rgba(33, 100, 144, 0.4)',
        borderColor: '#216490',
        borderWidth: 2,
        pointBackgroundColor: '#216490',
        data: [0, 0, 0, 0],
        label: 'Produits financés'
      }
    ]
  };
  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true
  };

  constructor(
    private agentService: BanqueService,
    private dossierService: DossierService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.agentId = Number(localStorage.getItem('agentId'));
    this.loadAgentDetails();
    this.loadRadarChartData();
  }

  private loadAgentDetails(): void {
    this.isLoading = true;
      this.agentId = Number(localStorage.getItem('agentId'));
    this.agentService.getAgentDetails(this.agentId).subscribe({
      next: (data) => {
        this.agent = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement de l\'agent.';
        this.isLoading = false;
      }
    });
  }

  private loadRadarChartData(): void {
        const agent = Number(localStorage.getItem('agentId'));
    this.dossierService.getProductImpactStats(agent).subscribe({
      next: (data) => {
          console.log("Données radar reçues :", data); // <-- Vérifie le contenu ici

       const nonDefini = data['non_defini'] || 0;
const peu = data['peu'] || 0;
const moyen = data['moyen'] || 0;
const eleve = data['eleve'] || 0;

this.radarChartData.datasets[0].data = [nonDefini, peu, moyen, eleve];
this.radarChartData = { ...this.radarChartData }; 

      },
      error: (err) => {
        console.error('Erreur chargement radar data', err);
      }
    });
  }
}
