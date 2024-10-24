import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { MaterialModule } from '../../../material.module';


const MODULES = [CommonModule, MaterialModule, RouterModule];

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [MODULES],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})

export class BreadcrumbComponent {

  private router = inject(Router);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  back : boolean = false;
  showBackArrow : boolean = true;
  pageInfo:any;

  constructor()
  {
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      let currentRoute = this.activatedRoute;

      // Desciende en la ruta activa para encontrar la ruta con "data"
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      if(this.router.url === '/painel'){
        this.showBackArrow = false;
       }else{
        this.showBackArrow = true;

       }

      // Suscríbete a los datos de la ruta
      currentRoute.data.subscribe((data) => {
        this.pageInfo = data;
        console.log('Ruta Data:', data);
      });
    });
  }


  goBack(){
    this.back = true
    setTimeout(() => {
      this.back = false;
      this.location.back();
    }, 100);
  }
}
