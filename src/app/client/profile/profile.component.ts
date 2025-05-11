import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

client: any; 
clientId: number | null = null;  


constructor(private router: Router,private clientService: ClientService){}

closeProfile() {
  this.router.navigate(['/client']);
}


  ngOnInit(): void {
    this.clientId = Number(localStorage.getItem('clientId'));
    this.clientService.getOneClient(this.clientId).subscribe({
      next: data => {
        this.client = data;
      },
      error: err => {
        console.error('Erreur chargement client', err);
      }
    });
  }
}
