import { Injectable } from "@angular/core";
import { Table } from "./table.model";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class TablesService {
    
  private tables: Table[] = [];
  private tablesUpdated = new Subject<Table[]>();

  constructor(private http: HttpClient) {}

  getTables() {
      this.http.get<{message: string, tables: Table[]}>("http://localhost:3000/api/tables")
      .subscribe((data) => {
        this.tables = data.tables;
        this.tablesUpdated.next([...this.tables]);
    });
  }

  getTableUpdatedListener() {
      return this.tablesUpdated.asObservable();
  }

  addTable(table: Table) {
      this.http.post<{message: string, table: Table}>("http://localhost:3000/api/tables", table)
        .subscribe(resData => {
          console.log(resData.message);
          console.log("Created table: ");
          console.log(table);
          this.getTables();
          this.tablesUpdated.next([...this.tables]);
      });
  }

  addProduct(order: Order) {
    const request = this.http.post<{message: string, order: Order}>("http://localhost:3000/api/tables/addOrder", order);
    request
        .subscribe(resData => {
          console.log(resData.message);
          console.log("Created order: ");
          console.log(order);
          this.getTables();
          this.tablesUpdated.next([...this.tables]);
      });
  }

  deleteOrder(order: Order, tableIndex: number, orderIndex: number, table: Table) {
    this.http.delete<{message: string}>("http://localhost:3000/api/tables/" + order._id + "/" + table._id)
        .subscribe(res => {
          this.tables[tableIndex].orders.splice(orderIndex, 1);
          this.tablesUpdated.next([...this.tables]);
    });
  }

  deleteTable(table: Table) {
    this.http.delete<{message: string}>("http://localhost:3000/api/tables/" + table._id)
      .subscribe(res => {
        console.log(res.message);
        this.getTables();
        this.tablesUpdated.next([...this.tables]);
      });
  }
}