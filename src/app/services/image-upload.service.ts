import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { map,tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private baseUrl = environment.baseUrl;

  constructor(
               private http: HttpClient,
  ) { 

  }


  getAllBackground( ) {

    return this.http.get<any>(`${this.baseUrl}api/image/getAllBackground`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllBackground service: ", res);
                }  
      ),            
      map( res => res )
    )
  }








}
