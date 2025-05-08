import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductsComponent } from './client/products/products.component';
import { FooterComponent } from './footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientComponent } from './client/client.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { ProviderComponent } from './provider/provider.component';
import { AjoutproductComponent } from './provider/ajoutproduct/ajoutproduct.component';
import { CatalogComponent } from './provider/catalog/catalog.component';
import { ListproductsComponent } from './provider/listproducts/listproducts.component';
import { ProfileComponent } from './client/profile/profile.component';
import { CardsComponent } from './adminboard/cards/cards.component';
import { SimulateurComponent } from './client/simulateur/simulateur.component';
import { CatalogsCornerComponent } from './adminboard/catalogs-corner/catalogs-corner.component';
import { HomeCornerComponent } from './adminboard/home-corner/home-corner.component';
import { ClientsCornerComponent } from './adminboard/clients-corner/clients-corner.component';
import { ProductdetailsComponent } from './client/productdetails/productdetails.component';
import { CatalogDisplayComponent } from './client/catalog-display/catalog-display.component';
import { ShoppingCartComponent } from './client/shopping-cart/shopping-cart.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    CheckoutComponent,
    ProductsComponent,
    FooterComponent,
  AuthLoginComponent,
  ProductdetailsComponent,
SidebarComponent,
AdminboardComponent,
ProviderComponent,
AjoutproductComponent,
CatalogComponent,
ListproductsComponent,
ProfileComponent,
CardsComponent,
SimulateurComponent,
CatalogsCornerComponent,
HomeCornerComponent,
ClientsCornerComponent,
CatalogDisplayComponent,
ShoppingCartComponent  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8000'],  // autorise l'envoi du token
        disallowedRoutes: ['http://localhost:8000/api/login_check']
      }
    }),

    RouterModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    AppRoutingModule,
    MatDialogModule, 
    MatSnackBarModule
     ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
