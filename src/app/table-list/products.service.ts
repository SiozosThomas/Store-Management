import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {

    private products: Product[];
    private productsUpdated = new Subject<Product[]>();

    constructor(private http: HttpClient) {
        this.products = [];
    }

    getProducts() {
        this.http.get<{message: string, menu: Product[]}>("http://localhost:3000/api/products")
            .subscribe((data) => {
                this.products = data.menu;
                this.productsUpdated.next([...this.products]);
        });
    }

    getProductsUpdatedListener() {
        return this.productsUpdated.asObservable();
    }

    addProduct(product: Product) {
        const request = this.http.post<{message: string, product: Product}>("http://localhost:3000/api/products", product);
        request.subscribe(resData => {
                console.log(resData.message);
                console.log("Created Product: ");
                console.log(product);
                this.getProducts();
                this.productsUpdated.next([...this.products]);
        });
    }

    deleteProduct(productId: string) {
        this.http.delete<{message: string}>("http://localhost:3000/api/products/" + productId)
          .subscribe(res => {
            console.log(res.message);
            this.getProducts();
            this.productsUpdated.next([...this.products]);
          });
      }
}