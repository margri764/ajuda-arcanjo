import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './services/error.service';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    let token = null;

    console.log(req.url);
    if (req.url.includes("https://accounts.google.com") || req.url.includes("googleAccount")) {
      
      return next(req.clone()).pipe(
        catchError((error: HttpErrorResponse) => this.errorHandle(error, req.url))
      );
    }

    if (this.authService.getToken()) {
      token = this.authService.getToken();
    } else {
      token = this.authService.getCookieToken();
    }


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    const authRequest = !token ? req : req.clone({ headers });

    return next(authRequest).pipe(
      catchError((error: HttpErrorResponse) => this.errorHandle(error, req.url))
    );
  }

  private errorHandle(error: HttpErrorResponse, url:string) {
    console.log(error);

    const errorMessage = this.errorService.getError(error, url);

    if (error.status === 200 && error.error && error.error.text === "Sesion finalizada") {
      this.errorService.logout();
    }

    return throwError(() => errorMessage);
  }
}

// Exporting the interceptor function
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const interceptorService = inject(InterceptorService);
  return interceptorService.intercept(req, next);
};
