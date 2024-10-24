import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideToastr(),
    provideHttpClient(withInterceptors([authInterceptor])),
    // provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
    // provideOAuthClient(),
    // provideStore(appReducers),
    // provideServiceWorker('ngsw-worker.js', {
    //     enabled: !isDevMode(),
    //     registrationStrategy: 'registerWhenStable:30000'
    // }),
],

};


