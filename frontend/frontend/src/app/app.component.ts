import {Input, Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { User } from './models/user';
import { RegistrationService} from './services/registration.service'
import { AuthenticationService } from './services/authentication.service';
import { SharedService } from './services/shared.service';
import { Logininfo } from './auth/logininfo';
import { TokenStorageService } from './auth/token-storage.service';
import { Singup } from './auth/singup';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[RegistrationService]
})
export class AppComponent implements OnInit {

 
  
  
  //login
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: Logininfo;
  private authority: string;


  //register
  formm: any = {};
  signupInfo: Singup;
  isSignedUp = false;
  isSignUpFailed = false;
  



  closeResult: string;
  registrationForm: FormGroup;
  loginForm:FormGroup;
  registrationInputs: Singup[];
  currentUser: Singup[];
  //isLoggedIn:boolean=false;

  cartItemCount:number=0;
  approvalText:string="";

  @Input()
  public alerts: Array<Alert> = [];

  message = "";
  public globalResponse: any;

  constructor(private sharedService:SharedService, private modalService: NgbModal,private fb: FormBuilder,private regService:RegistrationService ,private authService:AuthenticationService,private tokenStorage: TokenStorageService) {

  }
  ngOnInit()
  {
    this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);
 
    if (this.tokenStorage.getToken()) 
    {
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        } else if (role === 'ROLE_CUSTOMER') {
          this.authority = 'customer';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }

  }
  
 
  onSubmit() {
    console.log(this.form);

    this.loginInfo = new Logininfo(
    this.form.username,
    this.form.password);

    this.isLoggedIn=false;
    this.alerts=[];
    //console.log(user);
    this.authService.ValidateUser(this.loginInfo)
            .subscribe((data) => {

              this.tokenStorage.saveToken(data.accessToken);
              this.tokenStorage.saveUsername(data.username);
              this.tokenStorage.saveAuthorities(data.authorities);
              this.globalResponse = data;      
              this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();        
            },
            error => { //This is error part
              console.log(error.message);
              this.alerts.push({
                id: 2,
                type: 'danger',
                message: 'Either user name or password is incorrect.'
              });
            },
            () => {
                //  This is Success part
               // console.log(this.globalResponse);
                this.authService.storeToken(this.globalResponse.access_token);  
                this.alerts.push({
                  id: 1,
                  type: 'success',
                  message: 'Login successful. Now you can close and proceed further.',
                });
                this.isLoggedIn=true;
                this.GetClaims();
                
                
                }
              )


  }
  GetClaims()
  {
        this.authService.getClaims()
            .subscribe((result) => {
              this.globalResponse = result;              
            },
            error => { //This is error part
              console.log(error.message);
            },
            () => {
                //  This is Success part
               // console.log(this.globalResponse );
                let a=this.globalResponse;
                this.currentUser=this.globalResponse;
                this.authService.storeRole(this.currentUser);
                }
              )
            
  } 
  
  open(content) {
    this.alerts=[];
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
 
       OnRegister()
            {
              
              console.log(this.form);
 
              this.signupInfo = new Singup(
                this.form.name,
                this.form.username,
                this.form.email,
                this.form.password);
          
              this.authService.signUp(this.signupInfo)
                      .subscribe((result) => {
                        console.log(result);
                      this.isSignedUp = true;
                        this.isSignUpFailed = false;
                        this.globalResponse = result;              
                      },
                      error => { //This is error part
                        this.alerts.push({
                          id: 2,
                          type: 'danger',
                          message: 'Registration failed',
                        });
                      },
                      () => {
                          //  This is Success part
                          this.alerts.push({
                            id: 1,
                            type: 'success',
                            message: 'Registration successful.',
                          });
                          
                          }
                        )
                      }
               public closeAlert(alert: Alert) {
              const index: number = this.alerts.indexOf(alert);
              this.alerts.splice(index, 1);
            }

  
  LogOut()
  {
    this.isLoggedIn=false;
    this.authService.removeToken();
  }
 

}
export interface Alert {
  id: number;
  type: string;
  message: string;
}
