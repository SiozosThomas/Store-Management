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
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {

  private tablesSub: Subscription;
  private tablesEventsSub: Subscription;
  tables: Table[];
  sum: number[];
  selectedSum: number[];
  panelOpenState: boolean[];
  editTable: FormGroup;
  sameNumberError = false;

  constructor(private tablesService: TablesService,
      public dialog: MatDialog,
      private ngxService: NgxUiLoaderService, private toastr: ToastrService) {
    this.tables = [];
    this.panelOpenState = [];
    this.selectedSum = [];
    this.tablesEventsSub = this.tablesService.getTableEventsListener().subscribe(result => {
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
        this.setEmptyArrays();
      });
    this.ngxService.stop();
    this.editTable = new FormGroup({
      'name': new FormControl(null),
      'number': new FormControl(null, [Validators.min(0)])
    });
    this.sameNumberError = false;
  }

  onClickOrder(event: any, order: Order, index: number) {
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
    //this.selectedSum = [];
  }

  setEmptyArrays() {
    for (let table of this.tables) {
      this.panelOpenState.push(false);
      this.selectedSum.push(0);
    }
  }

  setSum() {
    var sum: any;
    for (let table of this.tables) {
      sum = 0;
      for (let order of table.orders) {
        sum += order.price;
      }
      this.sum.push(sum.toFixed(2));
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

  deleteOrder(order: Order, tableIndex: number, orderIndex: number, table: Table, event: any) {
    event.stopPropagation();
    if (event.path[2].style.backgroundColor === "rgb(178, 235, 242)") {
      this.selectedSum[tableIndex] -= order.price;
    }
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
      case "SameNumber":
        this.toastr.error('Can\'t create table with same number', null, {
          timeOut: 1000
        }).onTap.pipe(take(1));
        break;
      default:
        console.log("Not valid event for tables");
        break;
    }
  }

  saveEdit(tableSelected: Table, index: number): void {
    var numberUpdated = false;
    if (this.editTable.controls.number.value) {
      numberUpdated = true;
    }
    if (this.editTable.controls.name.value || this.editTable.controls.number.value) {
      const table: Table = ({
        _id: tableSelected._id,
        name: (this.editTable.controls.name.value) ? this.editTable.controls.name.value :
                tableSelected.name,
        number: (this.editTable.controls.number.value) ? this.editTable.controls.number.value :
                tableSelected.number
      });
      this.tablesService.updateTable(table, numberUpdated);
      this.panelOpenState[index] = false; 
    }
  }

  ngOnDestroy(): void {
    this.tablesEventsSub.unsubscribe();
    this.tablesSub.unsubscribe();
  }
}