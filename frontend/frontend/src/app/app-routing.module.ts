import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from '../app/components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { ProductdisplayComponent } from 'src/app/components/productdisplay/productdisplay.component';
import { CartComponent } from './components/cart/cart.component';
import { UpdateproductComponent } from './components/updateproduct/updateproduct.component';

const routes: Routes = [

  {
     path: "",
     component: ProductdisplayComponent},
  {
    path:"productdisplay"
    ,component: ProductdisplayComponent},
  {
    path: "profile",
    component: ProfileComponent},
  {
    path: "dashboard",
    component: DashboardComponent},
    {
      path: "updateproduct",
      component: UpdateproductComponent},
  {
    path: "admin",
    component:  AdminComponent},
  
  {
    path: "cart",
    component: CartComponent},
   // otherwise redirect to home
  {
    path: '**',
    redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
