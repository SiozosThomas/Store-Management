import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../table-list/product.model';
import { ProductsService } from '../table-list/products.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import {NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  private productsSub: Subscription;
  displayedColumns: string[] = ['name', 'price'];
  products: Product[];
  dataSource: Product[];

  constructor(public dialog: MatDialog, private productsService: ProductsService,
    private ngxService: NgxUiLoaderService) {
    this.products = [];
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.productsService.getProducts();
    this.productsSub = this.productsService.getProductsUpdatedListener()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.dataSource = this.products;
      });
    this.ngxService.stop();
  }

  addProduct() {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '50%',
      height: '50%',
      data: {data: FormGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("Data back");
      console.log(result);
      if(result) {
        const product: Product = ({
          name: result.data.value.name,
          price: result.data.value.price.toFixed(2)
        });
        this.productsService.addProduct(product);
      }
    });
  }

  deleteProduct(element: Product) {
    this.productsService.deleteProduct(element._id);
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }

}
