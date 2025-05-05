import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { ProviderComponent } from './provider/provider.component';
import { ProductsComponent } from './products/products.component';
import { AjoutproductComponent } from './provider/ajoutproduct/ajoutproduct.component';
import { CatalogComponent } from './provider/catalog/catalog.component';
import { ProfileComponent } from './client/profile/profile.component';
import { CardsComponent } from './adminboard/cards/cards.component';
import { SimulateurComponent } from './client/simulateur/simulateur.component';
import { CatalogsCornerComponent } from './adminboard/catalogs-corner/catalogs-corner.component';
import { HomeCornerComponent } from './adminboard/home-corner/home-corner.component';
import { ClientsCornerComponent } from './adminboard/clients-corner/clients-corner.component';

const routes: Routes = [
  {path:'client',component: ClientComponent,
    children :[{path:'profile',component:ProfileComponent}],
    canActivate: [AuthGuard],data: { roles: ['ROLE_CLIENT']}},
  {path:'adminboard',component: AdminboardComponent,
    children:[
      {path:'cards',component:CardsComponent},
      {path:'catalogues',component:CatalogsCornerComponent},
      {path:'home',component:HomeCornerComponent},
      {path:'clients',component:ClientsCornerComponent}],canActivate: [AuthGuard],data: { roles: ['ROLE_ADMIN']}},
  {path: 'checkout', component:CheckoutComponent},
  {path: 'simulateur', component:SimulateurComponent},
  {path:'products', component:ProductsComponent},
  {path:'login',component:AuthLoginComponent},
  {path:'provider',component:ProviderComponent,
    children: [
      {
        path: 'addproduct',
        component: AjoutproductComponent
      },
      {
        path: 'catalog',
        component: CatalogComponent
      }],
    canActivate: [AuthGuard],data: { roles: ['ROLE_PROVIDER']}},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
