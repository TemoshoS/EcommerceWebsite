import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {}

 
   canActivate(): boolean {
     if (!this.auth.isAuthenticated()) {
       //this.router.navigate(['login']);
       console.log('You are not authrised to view this page')
       return false;
     }
     return true;
   }
  
}
