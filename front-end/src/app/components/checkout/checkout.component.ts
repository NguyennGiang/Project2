import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { read } from '@popperjs/core';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
copyShippingAddesstoBillingAddess($event: Event) {
throw new Error('Method not implemented.');
}
  
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private checkoutService: CheckoutService, 
              private router: Router){}

  ngOnInit(): void {

    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);
    const userLastName = JSON.parse(this.storage.getItem('userLastName')!);
    const userFirstName = JSON.parse(this.storage.getItem('userFirstName')!);


    this.reviewCartDetail();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [userFirstName],
        lastName: [userLastName],
        phoneNumber: [''],
        email: [userEmail]
      }),
      shippingAddress: this.formBuilder.group({
        street: [''], 
        city: [''], 
        district: [''], 
        details: ['']
      })
    });    
  }

  reviewCartDetail() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  onSubmit() {
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    
    const cartItem = this.cartService.cartItems;
    let orderItems : OrderItem[] = cartItem.map(item => new OrderItem(item));

    let purcharse = new Purchase();
    purcharse.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value
    purcharse.customer = this.checkoutFormGroup.controls['customer'].value

    purcharse.order = order
    purcharse.orderItems = orderItems
    console.log(purcharse)

    this.checkoutService.placeOrder(purcharse).subscribe(
      {
        next: response => {
          alert(`Your order tracking number is ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => {
          alert(`${err.message}`);
        }
      }
    )
  }
  resetCart(){
    this.cartService.cartItems = []
    this.cartService.totalPrice.next(0)
    this.cartService.totalQuantity.next(0)

    this.checkoutFormGroup.reset()
    this.router.navigateByUrl("/product")
  }
}
