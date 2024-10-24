import { EventEmitter, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public toastr = inject(ToastrService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private cookieService = inject(CookieService);


  private phone : boolean = false;

  closeIsLoading$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  constructor() { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

  }

  getError(error : any, url:string) {
    console.log(error);


     if (error.status === 401) {
      this.closeIsLoading$.emit(true);
        if(this.phone){
          this.openSnackBar('Credenciais incorretas', 'Continuar')
        }else{
          this.errorToast('Credenciais incorretas');
        }
      return of(null);
     }


  // if (error.status === 429 && error.error.message.includes("Error! espera") ) {

  //   // this.openSnackBar(error.error.message ,'Continuar')
  //   //   this.closeIsLoading$.emit(true);
  //   //   return of(null);
  // }

  if (error.status === 400 ) {
    this.errorToast(error.error.message)
    this.closeIsLoading$.emit(true);
   return of(null);
 }
    

    // Devuelve un observable que emite el error original
    return throwError(() => error);

  }

  openSnackBar(message: string, action: string) {
    const snackBarRef = this._snackBar.open(message, action);
    // snackBarRef.onAction().subscribe(() => {
    //   // this.authGoogleService.incompleteSponsorProfile$.emit(true);
    // });
  }

  errorToast( error:string){
    this.toastr.error(error, 'Erro!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
    });
  }

  logout(){

       
    if (this.cookieService.check('ajuda_token')) {
      this.cookieService.delete('ajuda_token', '/');    
    }
    this.router.navigateByUrl("/login");
    
  }
}
