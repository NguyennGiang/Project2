import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';

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

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService){}

  ngOnInit(): void {

    this.reviewCartDetail();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        phoneNumber: [''],
        email: ['']
      }),
      billingAddress: this.formBuilder.group({
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

  onSubmit(){
    console.log("handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')!.value)
  }
}
