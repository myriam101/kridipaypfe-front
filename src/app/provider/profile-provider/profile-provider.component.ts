import { Component, OnInit } from '@angular/core';
import { ProviderComponent } from '../provider.component';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-profile-provider',
  templateUrl: './profile-provider.component.html',
  styleUrls: ['./profile-provider.component.css']
})
export class ProfileProviderComponent implements OnInit{

  provider:any;
  providerId: any; 
  error: string | null = null;

  constructor(private providerService:ProviderService){}
  ngOnInit(): void {
    this.loadProviderDetails();
  }

private loadProviderDetails(): void {
    this.providerId = Number(localStorage.getItem('providerId'));
    this.providerService.getProviderDetails(this.providerId).subscribe({
      next: (data) => {
        this.provider = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement du provider.';
      }
    });
  }
}
