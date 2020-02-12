
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Logininfo } from '../auth/logininfo';
import { Jwtresponse } from '../auth/jwtresponse';
import { Singup } from '../auth/singup';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //public apiURL:string="http://localhost:8087/api/auth/signin";
  private apiURL = 'http://localhost:8087/api/auth/signin';
  private signupUrl = 'http://localhost:8087/api/auth/signup';
  private apiRL = 'http://localhost:8087/api/auth';

  constructor(private httpClient:HttpClient) { }
 
  signUp(info: Singup): Observable<string> {
    return this.httpClient.post<string>(this.signupUrl, info, httpOptions);
  }


  ValidateUser (credentials:Logininfo): Observable<Jwtresponse> 
  {
    
    return this.httpClient.post<Jwtresponse>(this.apiURL,credentials,httpOptions )
    .pipe(
      map(res => res),
       catchError( this.errorHandler)
      );
  }
  getClaims ()
  {
    var reqHeader = new HttpHeaders({ 'Authorization':'Bearer '+ this.getToken()});
        reqHeader.append('Content-Type', 'application/json');
    return this.httpClient.get(this.apiRL+ '/Users',{ headers: reqHeader })
    .pipe(
      map(res => res),
       catchError( this.errorHandler)
      );
  }
  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  storeToken(token: string) {
    localStorage.setItem("token", token);
  }
  getToken() {
    return localStorage.getItem("token");
  }
  removeToken() {
    return localStorage.removeItem("token");
  }
  storeRole(role: any) {
    this.removeRole();
    localStorage.setItem('role', JSON.stringify(role));
  }
  getRole() {
     return JSON.parse(localStorage.getItem('role'));
  }
  removeRole() {
    return localStorage.removeItem("role");
  }
  errorHandler(error: Response) {  
    console.log(error);  
    return throwError(error);  
} 
}
