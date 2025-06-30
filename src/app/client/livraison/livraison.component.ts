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

  isLoadingCO2 = false;
  poidsTotal = this.api.getCartWeightStored() || 0;
  estimatedCO2: number | null = null;
  deliveryLine: L.Polyline | null = null;

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

  this.selectedLat = lat;
  this.selectedLng = lng;

  if (this.selectedMarker) {
    this.map.removeLayer(this.selectedMarker);
  }

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


      if (this.deliveryLine) {
        this.map.removeLayer(this.deliveryLine);
        this.deliveryLine = null;
      }

      // Récupérer les fournisseurs du panier
      this.api.getProvidersForCart(this.idcart).subscribe({
            next: (providers) => {
              if (providers.length > 0) {
                const firstProvider = providers[0];

                this.api.geocode(firstProvider.adress).subscribe({
                  next: (providerGeo) => {
                    const latlngs: [number, number][] = [
                      [this.selectedLat!, this.selectedLng!],
                      [parseFloat(providerGeo.lat), parseFloat(providerGeo.lon)],
                    ];

                    this.deliveryLine = L.polyline(latlngs, {
                      color: '#216490',
                      weight: 4,
                      opacity: 0.7,
                    }).addTo(this.map);
                    this.map.fitBounds(this.deliveryLine.getBounds(), { padding: [50, 50] });

                    // Calcul distance
                    this.api
                      .getDistance(
                        this.selectedLat!,
                        this.selectedLng!,
                        parseFloat(providerGeo.lat),
                        parseFloat(providerGeo.lon)
                      )
                      .subscribe({
                        next: (route) => {
                          this.isLoadingCO2 = true;
                          this.estimatedCO2 = null;
                          // Appel estimation CO2 avec poidsTotal et distance
                          this.api.estimateCO2(this.poidsTotal, route.distance_km).subscribe({
                            next: (co2Res) => {
                              this.estimatedCO2 = co2Res.co2_kg;
                              this.isLoadingCO2 = false;
                            },
                            error: () => {
                              this.estimatedCO2 = null;
                              this.isLoadingCO2 = false;
                            },
                          });
                        },
                        error: () => {
                          this.estimatedCO2 = null;
                        },
                      });
                  },
                  error: () => {
                    this.error = 'Erreur géocodage fournisseur';
                    this.estimatedCO2 = null;
                  },
                });
              } else {
                this.estimatedCO2 = null;
              }
            },
            error: () => {
              this.error = 'Erreur récupération fournisseurs';
              this.estimatedCO2 = null;
            },
          });
        },
        error: () => {
          this.address = 'Erreur reverse geocoding';
          this.estimatedCO2 = null;
        },
      });
    });

    this.form = this.fb.group({
      modeliv: [this.modeliv, Validators.required],
      address: ['', Validators.required],
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

  this.api.getProvidersForCart(cartId).subscribe({
    next: (providers) => {
      providers.forEach((provider: any) => {
        this.api.geocode(provider.adress).subscribe({
          next: (providerGeo) => {
            // Supprimer ancienne ligne
            if (this.deliveryLine) {
              this.map.removeLayer(this.deliveryLine);
            }
            // Tracer ligne
            const latlngs: [number, number][] = [
              [this.selectedLat!, this.selectedLng!],
              [parseFloat(providerGeo.lat), parseFloat(providerGeo.lon)]
            ];
            this.deliveryLine = L.polyline(latlngs, { color: '#216490', weight: 4, opacity: 0.7 }).addTo(this.map);
            this.map.fitBounds(this.deliveryLine.getBounds(), { padding: [50, 50] });

            // Calcul distance
            const coords = {
              lat1: this.selectedLat!,
              lon1: this.selectedLng!,
              lat2: parseFloat(providerGeo.lat),
              lon2: parseFloat(providerGeo.lon)
            };

            this.api.getDistance(coords.lat1, coords.lon1, coords.lat2, coords.lon2).subscribe({
              next: (route) => {
                // Ici on appelle estimateCO2 avec poidsTotal et distance
                this.api.estimateCO2(this.poidsTotal, route.distance_km).subscribe({
                  next: (co2Res) => {
                    const payload = {
                      adress_client: this.address,
                      distance: route.distance_km,
                      carbon_footprint: co2Res.co2_kg,  // résultat CO2 estimé
                      everyday_ride: everydayRide,
                      modeliv: modeliv,
                      client_ride: clientRide,
                      client_id: clientId,
                      provider_id: provider.id_provider,
                      adress_provider: provider.adress,
                      total_weight: this.poidsTotal
                    };

                    this.api.createDelivery(payload).subscribe({
                      next: () => {
                        this.deliverySummary = {
                          adresse: payload.adress_client,
                          modeLivraison: payload.modeliv,
                          fournisseur: payload.adress_provider,
                          distance: payload.distance,
                          everydayRide: payload.everyday_ride ? 'Oui' : 'Non',
                          co2Kg: payload.carbon_footprint.toFixed(2) + ' kg'
                        };
                      },
                      error: () => this.error = "Erreur lors de la création de la livraison"
                    });
                  },
                  error: () => this.error = "Erreur lors de l'estimation CO2"
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