import { Component, OnInit } from '@angular/core';
import { SimulatorUsageService } from 'src/app/services/simulator-usage.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  top3: {productId: number, productName: string, catalogName : string,simulationCount: number }[] = [];

  total = 0;
  withSimulation = 0;
  beforePurchase = 0;
  simulationRate = 0;
  averageAge = 0;

  pieChartData: any;
  lineChartData: any;
  barChartData: any;

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
            const label = ctx.label || '';
            const value = ctx.parsed || 0;
            return `${label} : ${value}`;
          }
        }
      }
    }
  };

  constructor(private service: SimulatorUsageService) {}

  ngOnInit(): void {
    this.service.getGlobalStats().subscribe(data => {
      this.total = data.total;
      this.withSimulation = data.with_simulation;
      this.beforePurchase = data.before_purchase;
      this.simulationRate = data.simulation_rate;
      this.averageAge = data.average_age;
          this.top3 = data.top3;


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

this.lineChartData = {
  labels: data.monthly_usage.map((m: any) => m.month),
  datasets: [{
    label: 'Utilisation mensuelle',
    data: data.monthly_usage.map((m: any) => m.count),
    fill: true,
    backgroundColor: 'rgba(229, 147, 0, 0.4)', // #E59300 transparent
    borderColor: '#E59300', 
    tension: 0.4
  }]
};

this.barChartData = {
  labels: data.by_client.map((c: any) => `Client ${c.clientId}`),
  datasets: [
    {
      label: 'Total Usages',
      data: data.by_client.map((c: any) => c.total),
      backgroundColor: 'rgba(33, 100, 144, 0.7)' // #216490 transparent
    },
    {
      label: 'Avec Simulation',
      data: data.by_client.map((c: any) => parseInt(c.withSimulation, 10)),
      backgroundColor: 'rgba(216, 14, 45, 0.7)' // #D80E2D transparent
    }
  ]
};

this.ageDonutChartData = {
  labels: Object.keys(data.age_groups),
  datasets: [{
    data: Object.values(data.age_groups),
    backgroundColor: [
      'rgba(216, 14, 45, 0.8)', // #D80E2D
      'rgba(33, 100, 144, 0.8)', // #216490
      'rgba(229, 147, 0, 0.8)', // #E59300
      'rgba(33, 100, 144, 0.5)' // version plus claire pour contraste
    ]
  }]
};

    });
  }
}
