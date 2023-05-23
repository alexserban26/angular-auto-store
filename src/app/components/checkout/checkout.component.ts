import { CartService } from './../../services/cart.service';
import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoStoreValidators } from 'src/app/validators/auto-store-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  showBillingAddress = true;
  private EMAIL_EXP: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService) { }

  ngOnInit(): void {
    
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        email: new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_EXP), AutoStoreValidators.notOnlyWhitspace])
      }),
      shippingAddress: this.formBuilder.group({
        addressLine2: [''],
        streetNo: new FormControl('', [Validators.required, Validators.minLength(1), AutoStoreValidators.notOnlyWhitspace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        country: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace])
      }),
      billingAddress: this.formBuilder.group({
        addressLine2: [''],
        streetNo: new FormControl('', [Validators.required, Validators.minLength(1), AutoStoreValidators.notOnlyWhitspace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        country: new FormControl('', [Validators.required, Validators.minLength(2), AutoStoreValidators.notOnlyWhitspace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(4), AutoStoreValidators.notOnlyWhitspace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(3), AutoStoreValidators.notOnlyWhitspace]),
        cardNumber: new FormControl('', [Validators.required, Validators.minLength(16), AutoStoreValidators.notOnlyWhitspace]),
        securityCode: new FormControl('', [Validators.required, Validators.minLength(3), AutoStoreValidators.notOnlyWhitspace]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.shopFormService.getCreditCardMonths(new Date().getMonth()+1).subscribe(
      data=>{
        this.creditCardMonths = data;
      }
    );
    this.shopFormService.getCreditCardYears().subscribe(
      data=>{
        this.creditCardYears = data;
      }
    );

}
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data)
  }

  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressStreetNo(){ return this.checkoutFormGroup.get('shippingAddress.streetNo');}
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressStreetNo(){ return this.checkoutFormGroup.get('billingAddress.streetNo');}
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardName(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityNumber(){ return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingAddressToBillingAddress(event: any) {
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.showBillingAddress = false;
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.showBillingAddress = true;
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

  }

}
