import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  previousKeyword: string = "";

  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    });
  }

  listProduct() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode){
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } 
    else {
      this.currentCategoryId = 1;
    }


    if (this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId = ${this.currentCategoryId}`)

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      this.processResult());
  }

  handleSearchProducts(){
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    if(this.previousKeyword != theKeyWord){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyWord;

    this.productService.searchProductPaginate(this.thePageNumber - 1, this.thePageSize, theKeyWord).subscribe(this.processResult());
  }

  processResult(){
    return (data: any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.theTotalElements = data.page.totalElements
        this.thePageSize = data.page.size;

    }
  }
  
  addToCart(theProduct: Product){
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}

