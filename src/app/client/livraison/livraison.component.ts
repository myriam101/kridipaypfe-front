import {  Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DeliveryService, WeightsByProvider } from 'src/app/services/delivery.service';
import { LocationiqService } from 'src/app/services/locationiq.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/pages/confirm/confirm.component';

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
  totalCO2Cart: number | null = null;

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
  idcart: any;
  form!: FormGroup;
  deliverySummaries: any[] = [];

  weightsByProvider: WeightsByProvider | null = null;

  constructor( private snackBar: MatSnackBar,
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
      providers.forEach((provider, index) => {
        this.api.geocode(provider.adress).subscribe({
          next: (providerGeo) => {
            const latlngs: [number, number][] = [
              [this.selectedLat!, this.selectedLng!],
              [parseFloat(providerGeo.lat), parseFloat(providerGeo.lon)],
            ];

            const line = L.polyline(latlngs, {
              color: '#216490',
              weight: 4,
              opacity: 0.7,
            }).addTo(this.map);

            // Ajuster la vue uniquement à la première ligne
            if (index === 0) {
              this.map.fitBounds(line.getBounds(), { padding: [50, 50] });
            }

            // Distance + CO₂ pour ce fournisseur
            const providerId = provider.id_provider;
            const providerWeight = this.weightsByProvider?.[String(providerId)] || 0;

            this.api.getDistance(
              this.selectedLat!, this.selectedLng!,
              parseFloat(providerGeo.lat), parseFloat(providerGeo.lon)
            ).subscribe({
              next: (route) => {
                this.api.estimateCO2(providerWeight, route.distance_km).subscribe({
                  next: (co2Res) => {
                    console.log(`→ ${provider.adress} | ${route.distance_km}km | ${co2Res.co2_kg}kg CO2`);
                    // Tu peux ici stocker dans un tableau les résumés si besoin
                  },
                  error: () => console.warn(`Erreur estimation CO₂ fournisseur ${providerId}`),
                });
              },
              error: () => console.warn(`Erreur OSRM fournisseur ${providerId}`),
            });
          },
          error: () => console.warn(`Erreur géocodage fournisseur ${provider.id_provider}`),
        });
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
      address: ['', Validators.required],
    });
  
// Récupère les poids par fournisseur stockés dans le service
    this.weightsByProvider = this.api.getCartWeightsByProviderStored();

    if (this.weightsByProvider) {
      console.log("Poids par fournisseur récupérés:", this.weightsByProvider);
   
      const totalGlobal = Object.values(this.weightsByProvider).reduce((sum, weight) => sum + weight, 0);
      console.log("Poids total global (somme des poids par fournisseur):", totalGlobal);

    } else {
      console.warn("Aucun poids par fournisseur n'est actuellement stocké dans le service.");
      
    }
}
getProviderNames(): string[] {
    return this.weightsByProvider ? Object.keys(this.weightsByProvider) : [];
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
createDeliveries(clientId: number, cartId: number) {
  if (this.selectedLat === null || this.selectedLng === null) {
    this.error = "Adresse non sélectionnée.";
    return of(null); 
  }

  return this.api.getProvidersForCart(cartId).pipe(
    switchMap(providers => {
      if (providers.length === 0) {
        return of([]); // Pas de fournisseurs, rien à faire
      }

      const deliveries$ = providers.map(provider => {
        const providerId = provider.id_provider;
        const providerWeight = this.weightsByProvider?.[String(providerId)] || 0;

        return this.api.geocode(provider.adress).pipe(
          switchMap(providerGeo => {
            // Tracer ligne sur la map
            const latlngs: [number, number][] = [
              [this.selectedLat!, this.selectedLng!],
              [parseFloat(providerGeo.lat), parseFloat(providerGeo.lon)]
            ];
            const line = L.polyline(latlngs, { color: '#216490', weight: 4, opacity: 0.7 }).addTo(this.map);
            this.map.fitBounds(line.getBounds(), { padding: [50, 50] });

            return this.api.getDistance(this.selectedLat!, this.selectedLng!, parseFloat(providerGeo.lat), parseFloat(providerGeo.lon)).pipe(
              switchMap(route => this.api.estimateCO2(providerWeight, route.distance_km).pipe(
                switchMap(co2Res => {
                  const payload = {
                    adress_client: this.address,
                    distance: route.distance_km,
                    carbon_footprint: co2Res.co2_kg,
                    client_id: clientId,
                    provider_id: providerId,
                    adress_provider: provider.adress,
                    total_weight: providerWeight,
                    cart_id: cartId
                  };

                  return this.api.createDelivery(payload).pipe(
                    tap(() => {
                      this.deliverySummaries.push({
                        adresse: payload.adress_client,
                        fournisseur: payload.adress_provider,
                        distance: payload.distance,
                        poids: providerWeight + ' kg',
                        co2Kg: payload.carbon_footprint.toFixed(2) + ' kg'
                      });
                      console.log('Livraison créée pour fournisseur:', providerId);
                    }),
                    catchError(err => {
                      console.error('Erreur lors de la création de la livraison fournisseur', providerId, err);
                      return of(null); // On continue même en cas d’erreur
                    })
                  );
                })
              ))
            );
          }),
          catchError(err => {
            console.error('Erreur géocodage fournisseur', providerId, err);
            return of(null);
          })
        );
      });

      // Attendre que toutes les créations finissent
      return forkJoin(deliveries$);
    }),
    catchError(err => {
      console.error('Erreur récupération fournisseurs', err);
      return of(null);
    })
  );
}


submitDelivery() {
  const address = this.form.get('address')?.value;

  this.address = address;

const dialogRef = this.dialog.open(ConfirmComponent, {
    width: '350px',
    data: {
      message: 'Voulez-vous vraiment valider cette commande?'
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.createDeliveries(
        this.clientId,
        this.idcart,
      ).subscribe({
        next: () => {
          // Ici on est sûr que TOUTES les livraisons ont été créées (ou tentées)
          this.cartService.validateCartByclient(this.clientId).subscribe({
            next: () => {
              this.snackBar.open('Commande validée avec succès.', 'Fermer', { duration: 4000 });
              this.cartService.refreshCartCount(this.clientId);

              this.api.getTotalCO2ByCart(this.idcart).subscribe({
                next: (res) => {
                  this.totalCO2Cart = res.total_co2_kg;
                  console.log('Total CO₂ pour le panier :', this.totalCO2Cart, 'kg');
                },
                error: () => {
                  console.warn("Erreur lors de la récupération du total CO₂.");
                  this.totalCO2Cart = null;
                }
              });
            },
            error: () => {
              this.snackBar.open('Erreur lors de la validation.', 'Fermer', { duration: 4000 });
            }
          });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création des livraisons.', 'Fermer', { duration: 4000 });
        }
      });

      this.form.reset();
      this.selectedMarker = null;
    }
  });
}



}