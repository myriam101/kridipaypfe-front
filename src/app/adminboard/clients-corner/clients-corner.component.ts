import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-clients-corner',
  templateUrl: './clients-corner.component.html',
  styleUrls: ['./clients-corner.component.css']
})
export class ClientsCornerComponent implements OnInit {
  clients: any[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Erreur lors de la récupération des clients :', err)
    });

  }
}
