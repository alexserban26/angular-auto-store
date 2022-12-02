import { ProductCategory } from './../common/product-category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryURL = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = this.baseUrl + '/search/findByNameContaining?name=' + keyword;

    return this.getProducts(searchUrl);
  }


  getProduct(productId: number): Observable<Product> {
    const getProductUrl = this.baseUrl + '/' + productId;

    return this.httpClient.get<Product>(getProductUrl);
  }

  getProductList(categoryId: number): Observable<Product[]>{

    const searchUrl = this.baseUrl + '/search/findByCategoryId?id=' + categoryId;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryURL).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
