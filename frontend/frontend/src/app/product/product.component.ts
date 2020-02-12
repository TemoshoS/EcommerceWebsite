import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
//import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  total: number = 0;
  cart: Product[];

  constructor(public service: ProductService) { }

  ngOnInit() {
    

  }

 

}