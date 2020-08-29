import { Component, OnInit, OnDestroy } from '@angular/core';
import { Table } from './models/table.model';
import {MatDialog} from '@angular/material/dialog';
import {NgxUiLoaderService } from 'ngx-ui-loader';

import { TablesService } from './services/tables.service';
import { Subscription } from 'rxjs';
import { AddDialogComponent } from './dialog/add-dialog.component';
import { Order } from './models/order.model';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {

  private tablesSub: Subscription;
  private createdTable: Subscription;
  tables: Table[];
  sum: number[];
  selectedSum: number[];

  constructor(private tablesService: TablesService,
      public dialog: MatDialog,
      private ngxService: NgxUiLoaderService, private toastr: ToastrService) {
    this.tables = [];
    this.createdTable = this.tablesService.getTableEventsListener().subscribe(result => {
      if (result) this.showToast(result);
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.tablesService.getTables();
    this.tablesSub = this.tablesService.getTableUpdatedListener()
      .subscribe((tables: Table[]) => {
        this.tables = tables;
        this.clearSum();
        this.setSum();
      });
    this.ngxService.stop();
  }

  onClick(event: any, order: Order, index: number) {
    if (event.target.style.backgroundColor === "rgb(178, 235, 242)") {
      event.target.style.backgroundColor = "white";
      this.selectedSum[index] -= order.price;
    } else {
      event.target.style.backgroundColor = "#b2ebf2";
      this.selectedSum[index] += order.price;
    }
  }

  clearSum() {
    this.sum = [];
    this.selectedSum = [];
  }

  setSum() {
    var sum: any;
    for (let table of this.tables) {
      sum = 0;
      for (let order of table.orders) {
        sum += order.price;
      }
      this.sum.push(sum.toFixed(2));
      this.selectedSum.push(0);
    }
  }

  addProduct(table: Table) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '50%',
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

  showToast(type: string) {
    switch(type) {
      case "Create":
        this.toastr.success('Table created!', null, {
          timeOut: 1000
        }).onTap.pipe(take(1));
        break;
      case "Delete":
        this.toastr.error('Table deleted!', null, {
          timeOut: 1000
        }).onTap.pipe(take(1));
        break;
      default:
        console.log("Not valid event for tables");
        break;
    }
  }

  ngOnDestroy(): void {
    this.createdTable.unsubscribe();
    this.tablesSub.unsubscribe();
  }
}