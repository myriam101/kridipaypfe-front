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

const routes: Routes = [
  {path:'client',component: ClientComponent,canActivate: [AuthGuard],data: { roles: ['ROLE_CLIENT']}},
  {path:'adminboard',component: AdminboardComponent,canActivate: [AuthGuard],data: { roles: ['ROLE_ADMIN']}},
  {path: 'checkout', component:CheckoutComponent},
  {path:'products', component:ProductsComponent},
  {path:'login',component:AuthLoginComponent},
  {path:'provider',component:ProviderComponent,
    children: [
      {
        path: 'addproduct',
        component: AjoutproductComponent
      }],
    canActivate: [AuthGuard],data: { roles: ['ROLE_PROVIDER']}},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
