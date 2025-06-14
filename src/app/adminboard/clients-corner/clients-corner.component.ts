import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-clients-corner',
  templateUrl: './clients-corner.component.html',
  styleUrls: ['./clients-corner.component.css']
})
export class ClientsCornerComponent implements OnInit {
  clients: any[] = [];
  isLoading = false; 
  selectedBonifPoints: any = null;

  constructor(private clientService: ClientService,private bonifService: PointsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;  // start loader
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false; // stop loader
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients :', err);
        this.isLoading = false; // stop loader aussi en cas d'erreur
      }
    });

  }
   openBonifModal(clientId: number) {
  this.bonifService.getClientBonifPoints(clientId).subscribe({
    next: (res) => {
      this.selectedBonifPoints = res;

      // Afficher la modale (via JS pur)
      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('bonifPointsModal')
      );
      modal.show();
    },
    error: (err) => {
      console.error('Erreur récupération points', err);
    }
  });
}
}
