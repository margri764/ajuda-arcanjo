import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../enviroments/enviroment';
import { map, tap } from 'rxjs';
import { saveDataSS } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private dialog = inject(MatDialog);
  private baseUrl = environment.baseUrl;
  // private store = inject(Store<AppState>);
  token : string = '';
  user : any;
  phone : boolean = false;
  private gMapKey = environment.googleMaps;


  constructor() { }

  setToken(token:string){
     this.token = token;
  }
  
  getToken(){
    return this.token
  }

  getCookieToken() {
    return this.cookieService.get('ajuda_token');
  }

  login( body:any){

    const {rememberCredentials} = body;

    console.log('rememberCredentials', rememberCredentials);

    return this.http.post<any>(`${this.baseUrl}api/auth/loginAjuda`, body) 
    
    .pipe(
      tap( ( {user, token, success}) =>{

              //si es el primer login el back devuelve el user sino no lo devuelve xq espera q se autentique con el codigo
            
              if(success ){
            
                if (this.cookieService.check('ajuda_token')) {
                  this.cookieService.delete('ajuda_token', '/');    
                }
               
                this.token = token;

                if(rememberCredentials){
                  const expirationDays = 90;
                  // 1: undefined es una cookie de sesion; 2: el path; 3: undefined es el dominio, 4: flag secure solo https
                  this.cookieService.set('ajuda_token', token, expirationDays, '/', undefined, true, 'Strict');
                }else{
                  saveDataSS('ajuda_token', token)
                  // const expirationDays = new Date();
                  //   // 1: undefined es una cookie de sesion; 2: el path; 3: undefined es el dominio, 4: flag secure solo https
                  //   this.cookieService.set('ajuda_token', token, expirationDays, '/', undefined, true, 'Strict');
                }


                this.user = user;
                const userToSS = { name: user.Nome_Completo, role:user.role, email: user.Email, Ruta_Imagen: user.Ruta_Imagen, iduser:user.iduser, idpropulsao: user.idpropulsao,  propulsao_name: user.propulsao_name, idunit: user.idunit  };
                saveDataSS('user', userToSS);
              }
                    
       }  
      ),            
      map( res => {console.log("from login Service: ",res);return res} )
    )
  }

  validateToken( body:any ){
    return this.http.post<any>(`${this.baseUrl}api/auth/validateToken`, body) 
    .pipe(
      tap( ( {user, success}) =>{ 
        if(success){console.log('res desde validateToken: ', success, user);}
        const userToSS = { name: user.Nome_Completo, role:user.role, email: user.Email, Ruta_Imagen: user.Ruta_Imagen, iduser:user.iduser, idpropulsao: user.idpropulsao,  propulsao_name: user.propulsao_name, idunit: user.idunit  };
        saveDataSS('user', userToSS);
      } ),            
      map( res => res )
    )
  }

  getAddressByCoords ( lat: string, lng : string) {

    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.gMapKey}`)
    .pipe(
     map( res =>  res))
   }

 
   

}
