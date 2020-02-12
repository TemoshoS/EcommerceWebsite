import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { Alert } from 'src/app/models/alert';
import { OrderDetails } from 'src/app/models/order-details';
import { User} from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderItem } from 'src/app/models/order-item';
import { Addressinfo } from 'src/app/auth/addressinfo';
import { AddressService } from 'src/app/services/address.service';
import { Producdto } from 'src/app/auth/producdto';
import { Login } from 'src/app/models/login';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  defaultQuantity:number=1;
  productAddedTocart:Product[];
  allTotal:number;
  currentUser: User[];
  orderDetail:OrderDetails;
  orderItem:OrderItem[];
  form: any = {};  
  address: Addressinfo;
  
  
   

  public globalResponse: any;
  public alerts: Array<Alert> = [];

  deliveryForm:FormGroup;


  constructor(private productService:ProductService,private fb: FormBuilder,private authService:AuthenticationService,private orderService:OrderService,private addS:AddressService) 
  {
    
   }
   onSubmit()
   {
 
     this.address=new Addressinfo(
       this.form.postalcode,
       this.form.streetaddress,
       this.form.city,
       this.form.province,
 
 
     );
    
     this.addS.addAddress(this.address).subscribe((response) => {
     console.log(response);
     this.globalResponse = response;  
     }
   
    )
 
   }



  ngOnInit() {
    this.productAddedTocart=this.productService.getProductFromCart();
    for (let i in this.productAddedTocart) {
      this.productAddedTocart[i].prodquantity=1;
   }
   this.productService.removeAllProductFromCart();
   this.productService.addProductToCart(this.productAddedTocart);
   this.calculteAllTotal(this.productAddedTocart);
  

   this.GetLoggedinUserDetails();

   this.deliveryForm = this.fb.group({
    username:  ['', [Validators.required]],
    deliveryaddress:['',[Validators.required]],
    phone:['',[Validators.required]],
    email:['',[Validators.required]],
    message:['',[]],
    amount:['',[Validators.required]],

  });

  this.deliveryForm.controls['username'].setValue(this.currentUser["username"]);
  this.deliveryForm.controls['phone'].setValue(this.currentUser["phone"]);
  this.deliveryForm.controls['email'].setValue(this.currentUser["email"]);
  this.deliveryForm.controls['amount'].setValue(this.allTotal);
  }
  onAddQuantity(product:Product)
  {
    //Get Product
    this.productAddedTocart=this.productService.getProductFromCart();
    this.productAddedTocart.find(p=>p.id==product.id).prodquantity = product.prodquantity+1;
    
  this.productService.removeAllProductFromCart();
  this.productService.addProductToCart(this.productAddedTocart);
  this.calculteAllTotal(this.productAddedTocart);
  this.deliveryForm.controls['amount'].setValue(this.allTotal);
   
  }
  onRemoveQuantity(product:Product)
  {
    this.productAddedTocart=this.productService.getProductFromCart();
    this.productAddedTocart.find(p=>p.id==product.id). prodquantity = product.prodquantity-1;
    this.productService.removeAllProductFromCart();
    this.productService.addProductToCart(this.productAddedTocart);
    this.calculteAllTotal(this.productAddedTocart);
    this.deliveryForm.controls['amount'].setValue(this.allTotal);

  }
  calculteAllTotal(allItems:Product[])
  {
    let total=0;
    for (let i in allItems) {
      total= total+(allItems[i].prodquantity *allItems[i].prodprice);
   }
   this.allTotal=total;
  }

  GetLoggedinUserDetails()
  {
    this.currentUser=this.authService.getRole();
            
  } 
  ConfirmOrder()
  {
    const date: Date = new Date();
    var id=this.currentUser['id'];
    var name=this.currentUser['username'];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var dateTimeStamp=day.toString()+monthIndex.toString()+year.toString()+minutes.toString()+hours.toString()+seconds.toString();
    let orderDetail:any={};
    
    //Orderdetail is object which hold all the value, which needs to be saved into database
    orderDetail.CustomerId=this.currentUser['id'];
    orderDetail.CustomerName=this.currentUser["username"];
    orderDetail.DeliveryAddress=this.deliveryForm.controls['deliveryaddress'].value;
    orderDetail.Phone=this.deliveryForm.controls['phone'].value;

    orderDetail.PaymentRefrenceId=id+"-"+name+dateTimeStamp;
    orderDetail.OrderPayMethod="Pay On Delivery";
    
    //Assigning the ordered item details
    this.orderItem=[];
    for (let i in this.productAddedTocart) {
      this.orderItem.push({
        ID:0,
        ProductID:this.productAddedTocart[i].id,
        ProductName:this.productAddedTocart[i]. prodname,
        OrderedQuantity:this.productAddedTocart[i].prodquantity,
        PerUnitPrice:this.productAddedTocart[i]. prodprice,
        OrderID:0,
      }) ;
   }
      //So now complete object of order is
    orderDetail.OrderItems=this.orderItem;

    this.orderService.PlaceOrder(orderDetail)
            .subscribe((result) => {
              this.globalResponse = result;              
            },
            error => { //This is error part
              console.log(error.message);
              this.alerts.push({
                id: 2,
                type: 'danger',
                message: 'Something went wrong while placing the order, Please try again.'
              });
            },
            () => {
                //  This is Success part
                this.alerts.push({
                  id: 1,
                  type: 'success',
                  message: 'Order has been placed succesfully.',
                });
                
                }
              )

  }
  public closeAlert(alert: Alert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
} 

}