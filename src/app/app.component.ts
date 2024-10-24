import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import { getDataSS } from './storage';

const MODULES = [CommonModule,  RouterModule, RouterOutlet];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public toastr = inject(ToastrService);
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);
  private router = inject(Router);


  title = 'ajuda-arcanjo';

  disabled : boolean = true;
  isLoading : boolean = false;
  phone : boolean = false;

  constructor() {

    this.phone = screen.width < 800; // Asignar directamente un valor booleano
  
    const ajuda_token = getDataSS('ajuda_token');
    const token = this.cookieService.get('ajuda_token');
  
    // Verifica si no hay token de sesión ni token de cookie
    if (!token && !ajuda_token) {
      this.router.navigateByUrl('/login');
      return; // Salir de la función si no hay tokens
    }
  
    // Usar el token disponible
    const tokenToCheck = token || ajuda_token; // Asignar el primer token que esté disponible
  
    //cargo el token para el interceptor
    if(ajuda_token){
      this.authService.setToken(ajuda_token);
    }

    if(tokenToCheck){

      const body = { token: tokenToCheck }; // Crear el objeto con el token
      
  
      this.authService.validateToken(body).subscribe(({ success }) => {
        if (!success) {
          this.router.navigateByUrl('/login'); // Redirigir si el token no es válido
        } else {
          this.router.navigateByUrl('/painel'); // Redirigir si el token es válido
        }
      });

    }
   
  }
  

  errorToast( error:string){
    this.toastr.error(error, 'Erro!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
    });
  }
}
