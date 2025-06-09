import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { CheckoutComponent } from './client/checkout/checkout.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { ProviderComponent } from './provider/provider.component';
import { AjoutproductComponent } from './provider/ajoutproduct/ajoutproduct.component';
import { ProfileComponent } from './client/profile/profile.component';
import { SimulateurComponent } from './client/simulateur/simulateur.component';
import { CatalogsCornerComponent } from './adminboard/catalogs-corner/catalogs-corner.component';
import { HomeCornerComponent } from './adminboard/home-corner/home-corner.component';
import { ClientsCornerComponent } from './adminboard/clients-corner/clients-corner.component';
import { ProductsComponent } from './client/products/products.component';
import { ShoppingCartComponent } from './client/shopping-cart/shopping-cart.component';
import { CartsComponent } from './provider/carts/carts.component';
import { ConsoleComponent } from './adminboard/console/console.component';
import { ProfileProviderComponent } from './provider/profile-provider/profile-provider.component';
import { ReglagesComponent } from './adminboard/reglages/reglages.component';
import { BanqueComponent } from './banque/banque.component';
import { DashboardComponent } from './banque/dashboard/dashboard.component';
import { DemandesComponent } from './banque/demandes/demandes.component';
import { GestionCatalogsComponent } from './provider/gestion-catalogs/gestion-catalogs.component';
import { GestionPointsComponent } from './provider/gestion-points/gestion-points.component';
import { BoardComponent } from './provider/board/board.component';
import { AuthRegisterComponent } from './pages/auth-register/auth-register.component';
import { GestionPointsAdminComponent } from './adminboard/gestion-points-admin/gestion-points-admin.component';
import { UnauthorizedComponent } from './provider/unauthorized/unauthorized.component';

const routes: Routes = [
  {path:'client',component: ClientComponent,
    children :[{path:'profile',component:ProfileComponent},{path:'shopping-cart',component:ShoppingCartComponent} ,{path: 'checkout', component:CheckoutComponent,
}],
    canActivate: [AuthGuard],data: { roles: ['ROLE_CLIENT']}},

    {path:'agence',component: BanqueComponent,
    children :[{path: 'dashboard', component:DashboardComponent,
},{path: 'demandes', component:DemandesComponent,
}],
    canActivate: [AuthGuard],data: { roles: ['ROLE_AGENT']}},
  {path:'adminboard',component: AdminboardComponent,
    children:[
      {path:'console',component:ConsoleComponent},
      {path:'catalogues',component:CatalogsCornerComponent},
      {path:'home',component:HomeCornerComponent},
      {path:'clients',component:ClientsCornerComponent},
      {path:'reglages',component:ReglagesComponent},
    {path:'pointsbonif',component:GestionPointsAdminComponent}],
      canActivate: [AuthGuard],data: { roles: ['ROLE_ADMIN']}},
  {path: 'simulateur', component:SimulateurComponent},
  {path:'products', component:ProductsComponent},
  {path:'login',component:AuthLoginComponent},
  { path: 'register', component: AuthRegisterComponent },

  {path:'provider',component:ProviderComponent,
    children: [
      {
        path:'home',
        component:BoardComponent
      },
      {
        path:'points',
        component:GestionPointsComponent
      },
      {

path: 'catalogues',
component:GestionCatalogsComponent
      },
      {
        path: 'addproduct',
        component: AjoutproductComponent
      },
      
      {
        path:'profile',component:ProfileProviderComponent
      },
      {path:'commandes',component:CartsComponent},
    {path:'unauthorized', component:UnauthorizedComponent}],
    canActivate: [AuthGuard],data: { roles: ['ROLE_PROVIDER']}},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
