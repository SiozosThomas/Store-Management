import { Component, OnInit, OnDestroy } from '@angular/core';
import { Table } from './table.model';
import {MatDialog} from '@angular/material/dialog';
import { Product } from './product.model';
import {NgxUiLoaderService } from 'ngx-ui-loader';

import { TablesService } from './tables.service';
import { Subscription } from 'rxjs';
import { AddDialogComponent } from './dialog/add-dialog.component';
import { Order } from './order.model';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {

  private tablesSub: Subscription;
  tables: Table[];

  constructor(private tablesService: TablesService,
      public dialog: MatDialog,
      private ngxService: NgxUiLoaderService) {
    this.tables = [];
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.tablesService.getTables();
    this.tablesSub = this.tablesService.getTableUpdatedListener()
      .subscribe((tables: Table[]) => {
        this.tables = tables;
      });
    this.ngxService.stop();
  }

  addProduct(table: Table) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      disableClose: true,
      width: '60%',
      height: '60%',
      data: {products: []}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("Data back");
      console.log(result);
      if (result) {
        for (let product of result.products) {
          var order: Order = ({
            name: product.name,
            price: product.price,
            quantity: 1,
            table: table.number
          });
          this.tablesService.addProduct(order);
        }
      }
    });
  }

  trackById(index: number, table: Table) {
    return table._id;
  }

  deleteOrder(order: Order, tableIndex: number, orderIndex: number, table: Table) {
    this.tablesService.deleteOrder(order, tableIndex, orderIndex, table);
  }

  deleteTable(table: Table) {
    this.tablesService.deleteTable(table);
  }

  ngOnDestroy(): void {
    this.tablesSub.unsubscribe();
  }
}