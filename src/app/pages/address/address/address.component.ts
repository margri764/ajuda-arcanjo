import { ChangeDetectorRef, Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable,  Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { getDataSS } from '../../../storage';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ErrorService } from '../../../services/error.service';
import { AuthService } from '../../../services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { CepModalComponent } from '../../../modals/cep-modal/cep-modal/cep-modal.component';

interface City {
  name : string,
  province : string,
  country: string
}

interface AddressSegmentationPair {
  address: string;
  segmentation: string | undefined;
  coords: any,
}

const MODULES = [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule, GoogleMapsModule];


declare var google: any;

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [MODULES],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent {


  private fb = inject(FormBuilder);
  private rendered = inject(Renderer2);
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);  



  displayedColumns: string[] = ['acronym', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;
  @ViewChild ("addedAdress" , {static: true} ) addedAdress! : ElementRef;
  @ViewChild ("form", {static: true} ) form! : ElementRef;
  @ViewChild ("top", {static: true} ) top! : ElementRef;
  @ViewChild('resultInput') resultInput!: ElementRef;
  @ViewChild('streetNumber') streetNumber!: ElementRef;

  mapa!: google.maps.Map;
  markers: any[] = [];

  myForm!: FormGroup;
  bannerStatus: boolean =false;
  showForm:boolean = false;
  selected:boolean = false;
  placeToSendForm:any;
  lat : any;
  lng : any;
  confirm : boolean = false;
  address : string = '';
  userLogin = null;
  user! : any;
  subscription! : Subscription;
  showLabelAddressError : boolean = false;
  isEditing : boolean = false;
  cities : any[]=[];
  city : City | null | undefined;
  subscription$ : Subscription | undefined;
  flag : string = '';
  loggedUser:any;
  addresses : any[]=[];
  addressSegmentationPairs: AddressSegmentationPair[] = [];
  brazilStates: any[] = [];
  isLoading : boolean = false;
  showMap : boolean = false;
  phone : boolean = false;
  selectedLocationCoords: { lat: number; lng: number; } | undefined;

  addressOptions: Observable<string[]> | undefined;
  provinceOptions: Observable<string[]> | undefined;
  addressSegmentations: any [] = [];
  showSearchLabel : boolean = false;
  stateOfBrasil : string = '';
  isEditingAddress : boolean = false;
  showLabelEditingAddress : boolean = false;
  indexEditingAddress: number | null | undefined;
  formAddress:any;
  codcad_address : any ;  
  addressLabel : boolean = false;

  estadosBrasil : string [] = [
    "AC", // Acre
    "AL", // Alagoas
    "AP", // Amapá
    "AM", // Amazonas
    "BA", // Bahia
    "CE", // Ceará
    "DF", // Distrito Federal
    "ES", // Espírito Santo
    "GO", // Goiás
    "MA", // Maranhão
    "MT", // Mato Grosso
    "MS", // Mato Grosso do Sul
    "MG", // Minas Gerais
    "PA", // Pará
    "PB", // Paraíba
    "PR", // Paraná
    "PE", // Pernambuco
    "PI", // Piauí
    "RJ", // Rio de Janeiro
    "RN", // Rio Grande do Norte
    "RS", // Rio Grande do Sul
    "RO", // Rondônia
    "RR", // Roraima
    "SC", // Santa Catarina
    "SP", // São Paulo
    "SE", // Sergipe
    "TO"  // Tocantins
  ];
  
  
constructor( ) 

{
      this.markers=[];


      (screen.width <= 800) ? this.phone = true : this.phone = false;

      this.dataSource = new MatTableDataSource();
      
      this.myForm = this.fb.group({
            search: [ '' ],
            city: [ ''],
            neighborhood: [ ''],
            streetName:[ ''],
            streetNumber:[ ''],
            province: [ ''],
            pairAddress: [ ''],
            description: [ ''],
            postal_code: [ ''],
          
    });

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
  
 }


ngOnInit() {


  // this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  

    this.brazilStates = this.estadosBrasil;

}



onAddressSelected(address:any, event: MatAutocompleteSelectedEvent) {
}


onSaveForm(){

// si estoy creando o editando una direccion todos los campos siempre van a ser required, esto lo tengo xq para poder pasar la validacion del stepper, si ya tengo una direccion tiene q marcar como valid (eso lo hace emitValidationStatus())
 

// if ( this.myForm.invalid ) {
//   this.myForm.markAllAsTouched();
//   return
// }

const formValues = this.myForm.value;


}

closeAddressLabel(){
  this.addressLabel = true
  setTimeout(() => {
    this.addressLabel = false;
    this.codcad_address = null
  }, 100);
}


resetForm(){
  this.myForm.reset();
  this.isEditingAddress = false;
  this.showLabelEditingAddress = false;
  this.showMap = false;
}


removeAddress( option:any ){


}

//obtengo la direccion actual y hago el dispatch de la direccion, 
addresByCoords(){

  this.isLoading = true;

  this.authService.getAddressByCoords(this.lat, this.lng).subscribe(
   (res) => { 
     if (res.status === 'OK') {
          console.log(res.results[0].formatted_address);
         }
  })
}

openInsertCEPModal(){

  const dialogRef = this.dialog.open(CepModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
        console.log('nueva direccion: ',result);
        this.setNewAddressByCEP(result);
        this.indexEditingAddress = null;
    setTimeout(()=>{ this.streetNumber.nativeElement.focus() },0)


   } 
 });

}


setNewAddressByCEP(result:any){

  const city = result.localidade;
  const neighborhood = result.bairro;
  const streetNumber = result.complemento;
  const streetName = result.logradouro;
  const postal_code = result.cep;
  const province = result.uf;

  const componentForm ={
                          city,
                          streetName,
                          neighborhood,
                          province,
                          postal_code,
                          streetNumber,
                          coords: {lat: 0, lng: 0}
                        };
  this.selectedLocationCoords = {lat: 0, lng: 0};

  Object.entries(componentForm).forEach( entry =>{
    const [key, value]= entry;
    this.myForm.controls[key].setValue(value);
  });

  console.log(this.myForm.value);
  this.goToForm()
}

ngAfterViewInit() {


  const opciones = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // this.lng = -35.034745;
      // this.lat = -64.243000;
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;

      this.cargarMapa(position);
      this.cargarAutocomplete();

    }, null, opciones);
  } else {
    console.log('navegador no compatible');
  }
 }
mapInitialized : boolean = false;

initializeMap(){
    setTimeout(() => {
      const opciones = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          this.lng = position.coords.longitude;
          this.lat = position.coords.latitude;
          this.cargarMapa(position);
          this.cargarAutocomplete();
        }, null, opciones);

        this.mapInitialized = true;
        
      } else {
        console.log('navegador no compatible');
      }
    }, 0); 

}

collapseMap(){
  this.showMap = !this.showMap;

  if( this.showMap && !this.mapInitialized ){
    this.initializeMap();
    // this.cdr.detectChanges(); // Forza la detección de cambios
  }
}



private cargarAutocomplete(){

  this.indexEditingAddress = null;

  const autocomplete = new google.maps.places.Autocomplete(this.inputPlaces.nativeElement, {
    // types: ['locality'],
    // fields: ['address_components', 'geometry'],
    types: ['geocode'], // Cambiado a 'geocode' para obtener direcciones completas
    fields: ['address_components', 'geometry', 'name'],
  });

  autocomplete.addListener('place_changed', () => {
    const place: any = autocomplete.getPlace();
    this.showForm = place.geometry !== undefined;

      // Guardar las coordenadas de latitud y longitud en selectedLocationCoords
      this.selectedLocationCoords = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };


    if (this.showForm) {
      this.mapa.setCenter(place.geometry.location);
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.mapa,
        title: 'Selected Location',
      });

      this.markers.push(marker);
      this.llenarFormulario(place);
      // console.log('place', place);
    }
  });
  

    // this.goToForm();


}

llenarFormulario(place:any){

  const getAddressComp = (type: any, index:any) => {
    const component = place.address_components.find(
      (comp: any) => comp.types[0] === type
    );

    if (component) {
      // Devuelve short_name si el tipo es 'route', de lo contrario devuelve long_name
      return type === 'route' ? component.short_name : component.long_name;
    }
  };


  const city = getAddressComp('administrative_area_level_2',0);
  const state = getAddressComp('administrative_area_level_1',0);
  const neighborhood = getAddressComp('sublocality_level_1',0);
  const province = getAddressComp('administrative_area_level_1', 2);
  const streetNumber = getAddressComp('street_number',0);
  const streetName = getAddressComp('route', 2);
  const postal_code = getAddressComp('postal_code', 0)

  const componentForm ={
                          city,
                          province,
                          streetName,
                          neighborhood,
                          postal_code,
                          streetNumber
                          // state,
                        };


  Object.entries(componentForm).forEach( entry =>{
    const [key, value]= entry;
    this.myForm.controls[key].setValue(value);
  });

  console.log(this.myForm.value);

}


cargarMapa( position:any){

  const opciones={
    center : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.mapa= new google.maps.Map(this.rendered.selectRootElement(this.divMap.nativeElement),opciones)


   const markerPosition= new google.maps.Marker({
    position: this.mapa.getCenter(),
    title: ''
   });

   markerPosition.setMap(this.mapa);
   this.markers.push(markerPosition);


}


setPinOnMap( address:any, index:number){

  this.goToForm();

  // es para poder editar
  this.indexEditingAddress = index;
  
  const location = new google.maps.LatLng( address.coords.lat, address.coords.lng );
  
  const marker = new google.maps.Marker({
    position: location,
    map: this.mapa,
    title: 'Localização selecionada'
  });
  
  this.mapa.setCenter(location);
  
  // const selectedAdress = this.addresses.find( item => item.address === address.address )


  const selectedAdress= this.addresses.find(item => item.coords.lat === address.coords.lat && item.coords.lng === address.coords.lng);
  // this.addressSegmentationPairs = this.addressSegmentationPairs.filter(item => item.coords.lat !== body.coords.lat && item.coords.lng !== body.coords.lng);

  this.myForm.patchValue({
      city: selectedAdress.city,
      streetName: selectedAdress.streetName,
      streetNumber: selectedAdress.streetNumber,
      province: selectedAdress.province,
      neighborhood: selectedAdress.neighborhood,
      postal_code: selectedAdress.postal_code,
      description: selectedAdress.description,
      coords: selectedAdress.coords,
  })

  this.selectedLocationCoords = selectedAdress.coords;

  this.isEditingAddress = true;
  this.showLabelEditingAddress = true;

}

showAddressSwal( msg : string) {
  
  Swal.fire({
    icon: 'question',
    title: "Este é o seu endereço?",
    text: msg,
    footer: "",
    allowOutsideClick: false,  
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed ) {
      // this.router.navigateByUrl('/login')
    }
  });
}


goToAddedAddress(){

  setTimeout( () => {
    this.addedAdress.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
   }
  )
}

goToTop(){

  setTimeout( () => {

    this.top.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
   },0)
}

goToForm(){

  setTimeout( () => {

    this.form.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
   }
  )
}

warningToast( msg:string){
  this.toastr.warning(msg, 'Verificar!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

validField( field: string ) {
  const control = this.myForm.controls[field];
  return control && control.errors && control.touched;
}

showErrorSwal( title : string, msg : string, footer : string) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: msg,
    footer: footer,
    allowOutsideClick: false,  
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
}

get f(){
  return this.myForm.controls;
}


ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.unsubscribe();
  }
}

                  
}
                
      






