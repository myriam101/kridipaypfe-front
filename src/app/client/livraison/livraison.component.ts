import {  Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DeliveryService } from 'src/app/services/delivery.service';
import { LocationiqService } from 'src/app/services/locationiq.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { ConfirmDialogComponent } from 'src/app/provider/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
const customIcon = L.icon({
  iconUrl: 'assets/marker.svg',
  iconSize: [50, 60],
  iconAnchor: [15, 40], 
  popupAnchor: [0, -35] 
});
@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class LivraisonComponent implements OnInit {

  address1 = '';
  address2 = '';
  result: any = null;
  error = '';
  address = '';
  map:any;
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  clientId:any;
  selectedMarker: L.Marker | null = null;
  clientRide = 'none';
  everydayRide = false;
  idcart: any;
  form!: FormGroup;
  deliverySummary: any = null;

  modelivOptions = [
  { value: 'point_relais', label: 'Point relais' },
  { value: 'domicile', label: 'Domicile' },
  { value: 'collecte', label: 'Collecte' }
];
  modeliv: any;

  constructor(    private snackBar: MatSnackBar,
  private dialog: MatDialog,
   private cartService: ProductService,  private fb: FormBuilder
,private router: Router,private locationIQ: LocationiqService,private api: DeliveryService) {}


ngOnInit() {
  this.clientId = Number(localStorage.getItem('clientId'));
  this.idcart = this.api.getCartId(); 

  this.map = L.map('map').setView([36.8, 10.18], 7); // centre: Tunis

  L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  }).addTo(this.map);

  this.map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
 // Enregistre les coordonnées sélectionnées
  this.selectedLat = lat;
  this.selectedLng = lng;
    // Supprimer l'ancien marqueur s’il existe
    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }

    // Ajouter le nouveau marqueur
    this.selectedMarker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
      .bindPopup('Chargement...')
      .openPopup();

    // Reverse Geocoding
    this.locationIQ.reverseGeocode(lat, lng).subscribe({
      next: res => {
        this.address = res.display_name;
        this.form.get('address')?.setValue(res.display_name);
        this.form.get('address')?.markAsTouched();

        this.selectedMarker?.bindPopup(`<strong>Adresse :</strong><br>${res.display_name}`).openPopup();
      },
      error: () => {
        this.address = 'Erreur reverse geocoding';
      }
    });
  });
  this.form = this.fb.group({
  modeliv: [this.modeliv, Validators.required],
  address: ['', Validators.required]  
});

}

  calculateRoute() {
    this.result = null;
    this.error = '';

    // Géocoder les deux adresses en parallèle
    this.api.geocode(this.address1).subscribe({
      next: res1 => {
        this.api.geocode(this.address2).subscribe({
          next: res2 => {
            this.api.getDistance(
              parseFloat(res1.lat), parseFloat(res1.lon),
              parseFloat(res2.lat), parseFloat(res2.lon)
            ).subscribe({
              next: route => {
                this.result = {
                  from: res1.display_name,
                  to: res2.display_name,
                  distance: route.distance_km,
                  duration: route.duration_min
                };
              },
              error: () => this.error = "Erreur lors du calcul de la route."
            });
          },
          error: () => this.error = "Adresse 2 introuvable."
        });
      },
      error: () => this.error = "Adresse 1 introuvable."
    });
  }
  
revenirPanier() {
  this.router.navigate(['/client/shopping-cart']);
}
createDeliveries(clientId: number, cartId: number, modeliv: string, clientRide: string, everydayRide: boolean) {
  if (this.selectedLat === null || this.selectedLng === null) {
    this.error = "Adresse non sélectionnée.";
    return;
  }

  // 1. Obtenir les fournisseurs du panier
  this.api.getProvidersForCart(cartId).subscribe({
    next: (providers) => {
      providers.forEach((provider: any) => {
        // 2. Géocoder le fournisseur
        this.api.geocode(provider.adress).subscribe({
          next: (providerGeo) => {
            // 3. Appeler OSRM pour calculer la distance
            const coords = {
              lat1: this.selectedLat!,
              lon1: this.selectedLng!,
              lat2: parseFloat(providerGeo.lat),
              lon2: parseFloat(providerGeo.lon)
            };

            this.api.getDistance(coords.lat1, coords.lon1, coords.lat2, coords.lon2).subscribe({
              next: (route) => {
                // 4. Envoyer à /add avec la distance
                const payload = {
                  adress_client: this.address,
                  distance: route.distance_km,
                  carbon_footprint: 0, 
                  everyday_ride: everydayRide,
                  modeliv: modeliv,
                  client_ride: clientRide,
                  client_id: clientId,
                  provider_id: provider.id_provider,
                  adress_provider:provider.adress
                };
                console.log('Payload envoyé au backend:', payload);

                this.api.createDelivery(payload).subscribe({
  next: () => {
    console.log('Livraison créée avec le provider', provider.id_provider);

    this.deliverySummary = {
      adresse: payload.adress_client,
      modeLivraison: payload.modeliv,
      fournisseur: payload.adress_provider,
      distance: payload.distance,
      everydayRide: payload.everyday_ride ? 'Oui' : 'Non'
    };
  },                  error: () => this.error = "Erreur lors de la création de la livraison"
                });
              },
              error: () => this.error = "Erreur OSRM"
            });
          },
          error: () => this.error = "Erreur géocodage provider"
        });
      });
    },
    error: () => this.error = "Erreur récupération des providers"
  });
}
submitDelivery() {
  const modeliv = this.form.get('modeliv')?.value;
  const address = this.form.get('address')?.value;

  this.modeliv = modeliv;
  this.address = address;

  // Ouvre la boîte de dialogue de confirmation
  const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      //  Si l’utilisateur a confirmé :
      this.createDeliveries(
        this.clientId,
        this.idcart,
        modeliv,
        this.clientRide,
        this.everydayRide
      );

      this.form.reset();
      this.selectedMarker = null;

      //valider le panier si tout est bon
      this.cartService.validateCartByclient(this.clientId).subscribe({
        next: () => {
          this.snackBar.open('Commande validée avec succès.', 'Fermer', { duration: 4000 });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la validation.', 'Fermer', { duration: 4000 });
        }
      });
    }
  });
}


}