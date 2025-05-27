import { Component, OnInit } from '@angular/core';
import { SimulatorUsageService } from 'src/app/services/simulator-usage.service';
import { ChartData, ChartOptions } from 'chart.js';

interface Top3Product {
  productId: number;
  productName: string;
  catalogName: string;
  simulationCount: number;
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  top3: Top3Product[] = [];

  total = 0;
  withSimulation = 0;
  beforePurchase = 0;
  simulationRate = 0;
  averageAge = 0;

  pieChartData: any;
  lineChartData: any;
  barChartData: any;
radarChartData: ChartData<'radar'> = {
    labels: [],
    datasets: []
  };

  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
  ageDonutChartData: any;
  ageDonutChartOptions: ChartOptions<'doughnut'> = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#444',
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label ?? '';
            const value = ctx.parsed ?? 0;
            return `${label} : ${value}`;
          }
        }
      }
    }
  };

  constructor(private service: SimulatorUsageService) {}

  ngOnInit(): void {
    this.service.getGlobalStats().subscribe(data => {
      // Vérifications basiques
      if (!data) {
        console.error('Aucune donnée reçue');
        return;
      }

      // Affectations simples
      this.total = data.total ?? 0;
      this.withSimulation = data.with_simulation ?? 0;
      this.beforePurchase = data.before_purchase ?? 0;
      this.simulationRate = data.simulation_rate ?? 0;
      this.averageAge = data.average_age ?? 0;
      this.top3 = Array.isArray(data.top3) ? data.top3 : [];
      const categories = data.categ.map((c: any) => c.categoryLabel);
      const values = data.categ.map((c: any) => c.completedSimulations);
      
      this.radarChartData = {
        labels: categories,
        datasets: [
          {
            label: 'Simulations abouties par catégorie',
            data: values,
            backgroundColor: 'rgba(33, 100, 144, 0.4)',
            borderColor: '#216490',
            borderWidth: 2,
            pointBackgroundColor: '#216490',
          }
        ]
      };
    
      // Pie chart : vérifier les données avant usage
      if (typeof data.with_simulation === 'number' && typeof data.before_purchase === 'number') {
        this.pieChartData = {
          labels: ['Avec Simulation', 'Avant Achat'],
          datasets: [{
            data: [data.with_simulation, data.before_purchase],
            backgroundColor: [
              'rgba(33, 100, 144, 0.8)',  // #216490 avec alpha 0.8
              'rgba(216, 14, 45, 0.7)'    // #D80E2D avec alpha 0.7
            ],
            borderColor: [
              'rgba(33, 100, 144, 1)',
              'rgba(216, 14, 45, 1)'
            ],
            borderWidth: 1
          }]
        };
      }

      // Line chart : vérifier que monthly_usage est un tableau
      if (Array.isArray(data.monthly_usage)) {
        this.lineChartData = {
          labels: data.monthly_usage.map((m: any) => m.month ?? ''),
          datasets: [{
            label: 'Utilisation mensuelle',
            data: data.monthly_usage.map((m: any) => m.totalCount ?? 0),
            fill: true,
            backgroundColor: 'rgba(229, 147, 0, 0.4)', // #E59300 transparent
            borderColor: '#E59300',
            tension: 0.4
          }]
        };
      }

      // Bar chart : vérifier que by_client est un tableau
      if (Array.isArray(data.by_client)) {
        this.barChartData = {
          labels: data.by_client.map((c: any) => `Client ${c.clientId ?? '?'}`),
          datasets: [
            {
              label: 'Total Usages',
              data: data.by_client.map((c: any) => c.total ?? 0),
              backgroundColor: 'rgba(33, 100, 144, 0.7)' // #216490 transparent
            },
            {
              label: 'Avec Simulation',
              data: data.by_client.map((c: any) => parseInt(c.withSimulation, 10) || 0),
              backgroundColor: 'rgba(216, 14, 45, 0.7)' // #D80E2D transparent
            }
          ]
        };
      }

      // Donut chart : vérifier que age_groups est un objet
      if (data.age_groups && typeof data.age_groups === 'object') {
        this.ageDonutChartData = {
          labels: Object.keys(data.age_groups),
          datasets: [{
            data: Object.values(data.age_groups),
            backgroundColor: [
              'rgba(216, 14, 45, 0.8)', // #D80E2D
              'rgba(33, 100, 144, 0.8)', // #216490
              'rgba(229, 147, 0, 0.8)', // #E59300
              'rgba(33, 100, 144, 0.5)' // plus clair
            ]
          }]
        };
        
      }
      

    }, error => {
      console.error('Erreur lors de la récupération des statistiques :', error);
    });
  }
}
