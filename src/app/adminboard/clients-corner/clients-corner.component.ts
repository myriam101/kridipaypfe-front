import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-clients-corner',
  templateUrl: './clients-corner.component.html',
  styleUrls: ['./clients-corner.component.css']
})
export class ClientsCornerComponent implements OnInit {
  clients: any[] = [];
  isLoading = false; 

  constructor(private clientService: ClientService) {}

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
}
