import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from "../../../shared/breadcrumb/breadcrumb/breadcrumb.component";
import { delay, filter } from 'rxjs';
import { ErrorService } from '../../../services/error.service';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { getDataSS } from '../../../storage';


const MODULES = [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule, BreadcrumbComponent, ImagenPathPipe];

interface User {
  name:string,
  Ruta_Imagen? : string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MODULES, ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  private location = inject(Location);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private errorService = inject(ErrorService);


  phone : boolean = false;
  toogle : boolean = false;
  back : boolean = false;
  isLoading : boolean = false;
  user! : User;
  isFixedBackground: string = '';
  constructor()
  {
    (screen.width <= 800) ? this.phone = true : this.phone = false;

    const user = getDataSS('user');
    if(user){
      this.user = user;
    }

this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => {if(emitted){this.isLoading = false;}});


  }
  goBack(){
    this.back = true
    setTimeout(() => {
      this.back = false;
      this.location.back();
    }, 100);
  }

  toggleBackground( item:string) {
    this.toogle= true
  }
  
  handleMenuClick(item: string, drawer: any) {
    // this.toggleBackground(menuItem);
    this.isFixedBackground = item;
    if (this.phone) {
      drawer.toggle();
    }
  }

  logout(){
    setTimeout(()=>{
      this.errorService.logout();
    }, 700)
   
  }

}
