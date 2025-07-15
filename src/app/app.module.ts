import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { ProviderComponent } from './provider/provider.component';
import { AjoutproductComponent } from './provider/ajoutproduct/ajoutproduct.component';
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
import { MatInputModule } from '@angular/material/input';
import { CartsComponent } from './provider/carts/carts.component';
import { ConsoleComponent } from './adminboard/console/console.component';
import { ModalfactureComponent } from './client/modalfacture/modalfacture.component';
import { DashboardComponent } from './banque/dashboard/dashboard.component';
import { ListproduitsComponent } from './banque/listproduits/listproduits.component';
import { NgChartsModule } from 'ng2-charts';
import { ReglagesComponent } from './adminboard/reglages/reglages.component';
import { BanqueComponent } from './banque/banque.component';
import { DemandesComponent } from './banque/demandes/demandes.component';
import { BienvenuComponent } from './banque/bienvenu/bienvenu.component';
import { GestionCatalogsComponent } from './provider/gestion-catalogs/gestion-catalogs.component';
import { GestionPointsComponent } from './provider/gestion-points/gestion-points.component';
import { BoardComponent } from './provider/board/board.component';
import { GestionPointsAdminComponent } from './adminboard/gestion-points-admin/gestion-points-admin.component';
import { ConfirmDialogAdminComponent } from './adminboard/confirm-dialog-admin/confirm-dialog-admin.component';
import { UnauthorizedComponent } from './provider/unauthorized/unauthorized.component';
import { DetailPointbonifComponent } from './adminboard/detail-pointbonif/detail-pointbonif.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { DetailspointComponent } from './adminboard/gestion-points-admin/detailspoint/detailspoint.component';
import { ProgresscrapperComponent } from './adminboard/progresscrapper/progresscrapper.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LivraisonComponent } from './client/livraison/livraison.component';
import { LogoutModalComponent } from './pages/logout-modal/logout-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerFactureComponent } from './client/profile/pdf-viewer-facture/pdf-viewer-facture.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BonifGamComponent } from './client/profile/bonif-gam/bonif-gam.component';
import { DemandeClotureComponent } from './banque/demande-cloture/demande-cloture.component';
import { PaliersBonifComponent } from './banque/paliers-bonif/paliers-bonif.component';
import { AddPalierDialogComponent } from './banque/paliers-bonif/add-palier-dialog/add-palier-dialog.component';
import { EditPalierDialogComponent } from './banque/paliers-bonif/edit-palier-dialog/edit-palier-dialog.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { VerificationComponent } from './adminboard/verification/verification.component';
import { ListproductsAdminComponent } from './adminboard/listproducts-admin/listproducts-admin.component';
import { LivraisonlistComponent } from './provider/livraisonlist/livraisonlist.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    ProductsComponent,
    FooterComponent,
    AuthLoginComponent,
    ProductdetailsComponent,
    AdminboardComponent,
    ProviderComponent,
    AjoutproductComponent,
    ListproductsComponent,
    ListproductsAdminComponent,
    ProfileComponent,
    CardsComponent,
    SimulateurComponent,
    CatalogsCornerComponent,
    HomeCornerComponent,
    ClientsCornerComponent,
    CatalogDisplayComponent,
    ShoppingCartComponent,
    CartsComponent,
    ConsoleComponent,
    ModalfactureComponent,
    DashboardComponent,
    ListproduitsComponent,
    ReglagesComponent,
    BanqueComponent,
    DemandesComponent,
    BienvenuComponent,
    GestionCatalogsComponent,
    GestionPointsComponent,
    BoardComponent,
    GestionPointsAdminComponent,
    ConfirmDialogAdminComponent,
    UnauthorizedComponent,
    DetailPointbonifComponent,
    ChatbotComponent,
    DetailspointComponent,
    ProgresscrapperComponent,
    LivraisonComponent,
    LogoutModalComponent,
    PdfViewerFactureComponent,
    BonifGamComponent,
    DemandeClotureComponent,
    PaliersBonifComponent,
    AddPalierDialogComponent,
    EditPalierDialogComponent,
    ConfirmComponent,
    VerificationComponent,
    LivraisonlistComponent  ],
  imports: [
    BrowserModule,
    PdfViewerModule,
    MatTooltipModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8000'], 
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
    MatSnackBarModule,
    MatInputModule,
    NgChartsModule,
    MatProgressSpinnerModule    
       ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
