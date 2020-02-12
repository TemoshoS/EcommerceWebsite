import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Http, Response } from '@angular/http';  
import { Observable, of, throwError, pipe} from "rxjs"
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Product } from '../models/product';
import {Producdto} from '../auth/producdto'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  public listAllURL = 'http://localhost:8087/api/auth/all';
  public addTo = 'http://localhost:8087/api/auth/addToCart';
  public  delProd = 'http://localhost:8087/api/auth/product/delete';
  public updP = 'http://localhost:8087/api/auth/product/update/{id}';
  public getPrI =  'http://localhost:8087/api/auth/product/get';
  

  constructor(private httpClient:HttpClient, private authService:AuthenticationService) {
    this.httpClient = httpClient;
   }
 
  
   saveProduct(formData: FormData): Observable <any>
   {
        return this.httpClient.post<any>('http://localhost:8087/api/auth/saveProduct', formData);
   }

  getProductById(id: number): Observable<Product> {  
    return this.httpClient.get<Product>(`${this.getPrI}/${id}`);  
  } 
  createProduct(product: Product): Observable<Product> {  
  
    return this.httpClient.put<Product>('http://localhost:8087/api/auth/saveProduct',product);  
  } 
 
  updateProduct(product: Product): Observable<Product> {  
    
    return this.httpClient.put<Product>(this.updP,product);  
  }  

   deleteProduct(id: number): Observable<any> 
  {
    return this.httpClient.delete(`${this.delProd}/${id}`);
  } 

  getAllProducts():Observable<Product[]> 
  {
    return this.httpClient.get<Product[]>(this.listAllURL);
  }
  addProductToCart(prodcuts: any) {
    localStorage.setItem("product", JSON.stringify(prodcuts));
    
  }
  getProductFromCart() {
    //return localStorage.getItem("product");
    return JSON.parse(localStorage.getItem('product'));
  }
  removeAllProductFromCart() {
    return localStorage.removeItem("product");
  }
  errorHandler(error: Response) {  
    console.log(error);  
    return throwError(error);  
} 
}
