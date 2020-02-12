import { Component, OnInit } from '@angular/core';  
import { FormBuilder, Validators, FormControl } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { ProductService } from 'src/app/services/product.service';  
import { Product } from 'src/app/models/product';  
import { Producdto } from 'src/app/auth/producdto';
import { Alert } from 'src/app/models/alert';
import { ActivatedRoute, Router } from '@angular/router';
  
@Component({  
  selector: 'app-updateproduct',  
  templateUrl: './updateproduct.component.html',  
  styleUrls: ['./updateproduct.component.css']  
})  
export class UpdateproductComponent implements OnInit { 

  public globalResponse: any; 
  public alerts: Array<Alert> = [];
  dataSaved = false;  
  productForm: any;  
  allProduct: Observable<Product[]>;   
  message = null;  
  productIdUpdate = null;
  
 
  
  constructor(private fb: FormBuilder, private productService:ProductService,private route: ActivatedRoute) { }  
  
  ngOnInit() {  
    this.productForm = this.fb.group({  
      prodname: ['', [Validators.required]],  
      proddecription: ['', [Validators.required]],  
      prodprice: ['', [Validators.required]],  
      category: ['', [Validators.required]],  
      prodquantity: ['', [Validators.required]],  
      
    });  
    
    this.loadallProduct();  
  }  
  loadallProduct() {  
    this.allProduct = this.productService.getAllProducts();  
  }  
  onFormSubmit() {  
    this.dataSaved = false;  
    const product = this.productForm.value;  
    this.updateProduct(product);  
    this.productForm.reset();  
  }  
 
  loadProductToEdit(productId: number) {  

  
    this.productService.getProductById(productId).subscribe(product=> {  
       
      this.productIdUpdate = product.id;  
      this.productForm.controls['prodname'].setValue(product.prodname);  
      this.productForm.controls['proddecription'].setValue(product.proddecription);  
      this.productForm.controls['prodprice'].setValue(product.prodprice);  
      this.productForm.controls['category'].setValue(product.category);  
      this.productForm.controls['prodquantity'].setValue(product.prodquantity);  
       
      this.message = null;  
      this.dataSaved = false; 
     
    });  
  
  }  

  products(product: Product)
  {
    this.productForm.patchValue({

      prodname: product.prodname,
      proddecription: product.proddecription,
      prodprice: product.prodprice,
      category: product.category,
      prodquantity: product.prodquantity
    })

  }

  updateProduct(product: Product) {  

        product.id = this.productIdUpdate;  
        this.productService.updateProduct(product).subscribe(() => {  
        this.dataSaved = true;  
        this.loadallProduct();  
        this.productIdUpdate = null;  
        this.productForm.reset();  
      });  
      
  }   
   
  resetForm() {  
    this.productForm.reset();  
    this.message = null;  
    this.dataSaved = false;  
  }  


  public closeAlert(alert: Alert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
} 
}