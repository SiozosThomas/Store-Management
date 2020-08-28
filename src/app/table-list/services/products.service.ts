import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/products";

@Injectable({ providedIn: 'root' })
export class ProductsService {

    private products: Product[];
    private productsUpdated = new Subject<Product[]>();

    constructor(private http: HttpClient) {
        this.products = [];
    }

    getProducts() {
        this.http.get<{message: string, menu: Product[]}>(BACKEND_URL)
            .subscribe((data) => {
                this.products = data.menu;
                this.productsUpdated.next([...this.products]);
        });
    }

    getProductsUpdatedListener() {
        return this.productsUpdated.asObservable();
    }

    addProduct(product: Product) {
        const request = this.http.post<{message: string, product: Product}>(BACKEND_URL, product);
        request.subscribe(resData => {
                console.log(resData.message);
                console.log("Created Product: ");
                console.log(product);
                this.getProducts();
                this.productsUpdated.next([...this.products]);
        });
    }

    deleteProduct(productId: string) {
        this.http.delete<{message: string}>(BACKEND_URL + "/" + productId)
          .subscribe(res => {
            console.log(res.message);
            this.getProducts();
            this.productsUpdated.next([...this.products]);
          });
      }
}