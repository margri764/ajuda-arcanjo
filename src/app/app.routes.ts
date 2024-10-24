import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { AddressComponent } from './pages/address/address/address.component';
import { LoginComponent } from './auth/login/login/login.component';

export const routes: Routes = [

  { path: 'autenticacao', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

    
  { 
    path: 'painel', component: HomeComponent,  data: { title: 'Painel' },
    children:[
      { path: 'endereco', component: AddressComponent,  data: { title: 'Endereco' }},
   ] },

  { path: 'login', component: LoginComponent,  data: { title: 'login' } },
 
  { path: "", redirectTo: "/login", pathMatch: 'full' },
  { path: '**', redirectTo: '/error' },

  ];
    
  
  @NgModule({
      imports: [ 
                RouterModule.forRoot(routes),
              ],
      exports: [ RouterModule ],
   })
   
   export class AppRoutingModule { }
   
