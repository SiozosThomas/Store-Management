import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../table-list/models/product.model';
import { ProductsService } from '../table-list/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import {NgxUiLoaderService } from 'ngx-ui-loader';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  private productsSub: Subscription;
  displayedColumns: string[] = ['name', 'price', "_id"];
  products: Product[];
  dataSource = new MatTableDataSource<Product>(this.products);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.paginator = this.paginator;
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
