

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';


export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [

      { path: 'login', component: LoginComponent,  data: { title: 'login' } },
    

    ],
  },
];
