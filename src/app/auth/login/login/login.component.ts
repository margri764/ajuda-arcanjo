import { ChangeDetectorRef, Component, ElementRef, inject, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription, delay } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { ValidateService } from '../../../services/validate.service';
import { ImageUploadService } from '../../../services/image-upload.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

const MODULES = [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule];

@Component({
  selector: 'app-login',
  
  templateUrl: './login.component.html',
  standalone: true,
  imports: [MODULES],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);
  public toastr = inject(ToastrService);
  private cookieService = inject(CookieService)
  private validatorService = inject(ValidateService);
  private cdr = inject(ChangeDetectorRef);
  private imageUploadService = inject(ImageUploadService);
  // private modalService: NgbModal,

  myForm!: FormGroup;
  myForm2!: FormGroup;
  submitted : boolean = false;
  showLogin: boolean = true;
  isLoading : boolean = false;
  isSending : boolean = false;

  noVerified : boolean = false;
  noRole : boolean = false;
  successContactUs : boolean = false;
  successResendPass : boolean = false;
  showResendPass : boolean = false;
  successResendVerify : boolean = false;
  phone : boolean = false;
  isDivVisible : boolean = false;
  position : boolean = false;
  sendingAuth : boolean = false;

  private destroy$ = new Subject<void>();
  private noVerifySubscription! : Subscription;
  msg : string = '';
  show500 : boolean = false;
  arrBackground : any []=[]
  backgroundImage : string= '';
  sendMeACopy : boolean = false;
  osInfo: any;
  passwordVisible = false;
  confirmVisible = false;

  constructor()
   {

    (screen.width <= 800) ? this.phone = true : this.phone = false;
     
   }


  ngOnInit(): void {


    if (this.cookieService.check('token')) {
      this.cookieService.delete('token', '/');    
    }

    this.getInitBackground();

    this.checkDeviceInfo();

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});


    this.myForm = this.fb.group({
      email:     [ '', [Validators.required,Validators.pattern(this.validatorService.emailPattern)] ],
      password:  [ '', [Validators.required]],
      rememberCredentials : [ false, [Validators.required]],
  
    });

  }

  get f() {
    return this.myForm.controls;
  }

  changeBackground(): void {
    if(this.arrBackground.length > 0){
      var fondoAleatorio =  this.arrBackground[Math.floor(Math.random() * this.arrBackground.length)];
      this.backgroundImage = fondoAleatorio.filePath;
      this.backgroundImage = this.backgroundImage.replace(/\(/g, '%28').replace(/\)/g, '%29');
      this.cdr.detectChanges();
    }

  }

  getInitBackground(){
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.filter((background:any) => background.active === 1);
          this.arrBackground = this.arrBackground.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
            const serverURL = 'https://arcanjosaorafael.org/backgrounds/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });
          this.changeBackground()
          
        }
      })
  }

  login(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const email = this.myForm.get('email')?.value;
    const password = this.myForm.get('password')?.value;
    const rememberCredentials = this.myForm.get('rememberCredentials')?.value;
    this.isLoading = true;

    const body = { email, password, rememberCredentials}

    this.authService.login( body ).subscribe(
      ({success})=>{

        if(success){
          setTimeout(()=>{ 
              this.isLoading = false;
              this.router.navigateByUrl('/painel')
            }, 400);

        }
      })
  }
  
   rememberMe ($event : MatSlideToggleChange): void{

      let isChecked = $event.checked;  

      if(isChecked){
         this.myForm.get('rememberCredentials')?.setValue(true);
      }else{
        this.myForm.get('rememberCredentials')?.setValue(false);
      }


  }

  openDialog(){

  }

  togglePasswordVisibility(value : string) : void {
    (value == "password") ? this.passwordVisible = !this.passwordVisible : '';
    (value == "confirm") ? this.confirmVisible = !this.confirmVisible : '';
}


get emailErrorMsg(): string {

  const errors = this.myForm.get('email')?.errors;
  if ( errors?.['required'] ) {
    return 'El email es obligatorio';
  } else if ( errors?.['pattern'] ) {
    return 'El valor ingresado no tiene formato de correo';
  } 
  return ''
}

  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  

  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
    this.position = !this.position;
  }

  //  me desuscribo al timer
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if(this.noVerifySubscription){
        this.noVerifySubscription.unsubscribe()
    }
  }


  checkDeviceInfo() {
    const userAgent = navigator.userAgent;
    let osInfo = '';
  
    if (userAgent.match(/Win64|WOW64/)) {
      osInfo += 'Windows 64 bits';
    } else if (userAgent.match(/Win32/)) {
      osInfo += 'Windows 32 bits';
    } else if (userAgent.match(/Android/)) {
      osInfo += 'Android';
    } else {
      osInfo += 'Otro sistema operativo';
    }

    this.osInfo = osInfo;
  }

  //reinicio el boolea por si se cancela el toast
  closeToast(){
    this.noRole = false;
   }

   validField(field: string) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
  }


}