import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BanqueService } from 'src/app/services/banque.service';
import { DossierService } from 'src/app/services/dossier.service';

export interface MonthlyEcoStat {
  total: number;
  eco_financed: number;
  percentage: number;
}

export interface EcoFinancedStats {
  monthly: Record<string, MonthlyEcoStat>;
  total: {
    total: number;
    eco_financed: number;
    percentage: number;
  };
}
export interface rabais {
   totalClients : number,
    clientsAvecRabais: number,
    pourcentage : number
}

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
  ecoStats: EcoFinancedStats | null = null;
  currentMonthStats: MonthlyEcoStat | null = null;
rabaisstats :rabais | undefined;
  loading = true;
currentMonthKey = new Date().toISOString().slice(0, 7); // ex: "2025-07"

  constructor(
    private agentService: BanqueService,
    private dossierService: DossierService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.agentId = Number(localStorage.getItem('agentId'));
    this.loadAgentDetails();
    this.loadRadarChartData();
    this.dossierService.getEcoFinancedStats(this.agentId).subscribe({
    next: (res) => {
      this.ecoStats = res;
      this.currentMonthStats = this.ecoStats?.monthly[this.currentMonthKey] || null;

    },
    error: () => {
      console.error('Erreur lors de la récupération des stats');
    }
  });
    this.dossierService.getRabaispourcentage(this.agentId).subscribe({
    next: (res) => {
      this.rabaisstats = res;

    },
    error: () => {
      console.error('Erreur lors de la récupération des stats');
    }
  });
  
  }
  
  keepDescendingOrder = (a: any, b: any) => b.key.localeCompare(a.key);

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


      },
      error: (err) => {
        console.error('Erreur chargement radar data', err);
      }
    });
  }
}
