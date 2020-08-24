import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TableListComponent } from '../table-list.component';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css']
  })
  export class AddDialogComponent implements OnInit, OnDestroy {

    products: Product[];
    selectedProducts: boolean[];
    private productsSub: Subscription;
  
    constructor(private productsService: ProductsService,
      public dialogRef: MatDialogRef<TableListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {products: Product[]}) {
        this.products = [];
        this.selectedProducts = [];
    }

    ngOnInit(): void {
      this.productsService.getProducts();
      this.productsSub = this.productsService.getProductsUpdatedListener()
        .subscribe((products: Product[]) => {
          this.products = products;
          if (this.selectedProducts.length === 0) this.createSelectedProducts();
      });
    }

    createSelectedProducts(): void {
      for(let i in this.products) {
        this.selectedProducts.push(false);
      }
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

    ngOnDestroy() {
      this.productsSub.unsubscribe();
    }
  
  }