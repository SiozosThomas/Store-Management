import { Component, OnInit, OnDestroy } from '@angular/core';
import { Table } from './table.model';
import {MatDialog} from '@angular/material/dialog';
import { Product } from './product.model';

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

  constructor(private tableService: TablesService, public dialog: MatDialog) {
    this.tables = [];
  }

  ngOnInit(): void {
    this.tableService.getTables();
    this.tablesSub = this.tableService.getTableUpdatedListener()
      .subscribe((tables: Table[]) => {
        this.tables = tables;
      });
  }

  addProduct(tableNumber: number) {
    const order: Order = ({
      name: "Fish",
      price: 12,
      quantity: 1,
      table: 1
    });
    console.log(this.tables);
    this.tableService.addProduct(order, tableNumber);
    console.log("After");
    console.log(this.tables);
    
    const dialogRef = this.dialog.open(AddDialogComponent, {
      disableClose: true,
      width: '80%',
      height: '80%',
      data: {products: []}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("Data back");
      console.log(result);
    });
    // const order: Order = ({
    //   name: "Fish",
    //   price: 12,
    //   quantity: 1,
    //   table: 1
    // });
    // this.tableService.addProduct(order);
    // this.tableService.getTables();
    // this.tablesSub = this.tableService.getTableUpdatedListener()
    //   .subscribe((tables: Table[]) => {
    //     this.tables = tables;
    // });
    // console.log(tableNumber);
    // const table: Table = {
    //   name: "Test",
    //   number: 8
    // };
    // this.tableService.addTable(table);
  }

  trackById(index: number, table: Table) {
    return table._id;
  }

  deleteOrder(order: Order, tableIndex: number, orderIndex: number) {
    this.tableService.deleteOrder(order);
    this.tableService.deleteOrderFromTable(order, tableIndex, orderIndex);
  }

  deleteTable(tableNumber: number) {

  }

  ngOnDestroy(): void {
    this.tablesSub.unsubscribe();
  }
}