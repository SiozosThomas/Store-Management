import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TableListComponent } from '../table-list.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { Subscription } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css']
  })
  export class AddDialogComponent implements OnInit, OnDestroy {

    products: Product[];
    selectedProducts: boolean[];
    private productsSub: Subscription;
    displayedColumns: string[] = ['name', 'price', '_id'];
    dataSource = new MatTableDataSource<Product>(this.products);
    mobile = false;
    pageEvent: PageEvent;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
    constructor(private productsService: ProductsService,
      public dialogRef: MatDialogRef<TableListComponent>, private deviceService: DeviceDetectorService,
      @Inject(MAT_DIALOG_DATA) public data: {products: Product[]}) {
        this.products = [];
        this.selectedProducts = [];
    }

    ngOnInit(): void {
      if (this.deviceService.isMobile()) {
        this.mobile = true;
        this.dialogRef.disableClose = true;
        this.dialogRef.updateSize("100%", "80%");
      } else {
        this.mobile = false;
      }
      this.productsService.getProducts();
      this.productsSub = this.productsService.getProductsUpdatedListener()
        .subscribe((products: Product[]) => {
          this.products = products;
          this.dataSource = new MatTableDataSource<Product>(this.products);
          this.dataSource.paginator = this.paginator;
          if (this.selectedProducts.length === 0) this.createSelectedProducts();
      });
    }

    createSelectedProducts(): void {
      for(let i in this.products) {
        this.selectedProducts.push(false);
      }
    }

    onChange(product: Product) {
      const selectedProduct = this.products.findIndex((element) => element === product);  
      this.selectedProducts[selectedProduct] = !this.selectedProducts[selectedProduct];
    }

    saveOrder() {
      this.data.products = this.findSelectedProducts();
      this.dialogRef.close({products: this.data.products});
    }

    findSelectedProducts(): Product[]{
      const selectedProducts: Product[] = [];
      for(let i in this.selectedProducts) {
        if (this.selectedProducts[i]) selectedProducts.push(this.products[i]);
      }
      return selectedProducts;
    }

    cancel() {
      this.dialogRef.close({products: this.data.products});
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    ngOnDestroy() {
      this.productsSub.unsubscribe();
    }
  
  }