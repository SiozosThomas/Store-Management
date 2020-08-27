import { Injectable } from "@angular/core";
import { Table } from "./table.model";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class TablesService {
    
  private tables: Table[] = [];
  private tablesUpdated = new Subject<Table[]>();
  private tableEvents = new Subject<string>();
  private error = new Subject<string>();

  constructor(private http: HttpClient) {}

  getTableUpdatedListener() {
    return this.tablesUpdated.asObservable();
  }

  getTableEventsListener() {
    return this.tableEvents.asObservable();
  }

  getErrorListener() {
    return this.error.asObservable();
  }

  getTables() {
      this.http.get<{message: string, tables: Table[]}>("http://localhost:3000/api/tables")
      .subscribe((data) => {
        this.tables = data.tables;
        this.tablesUpdated.next([...this.tables]);
    });
  }

  addTable(table: Table) {
      this.http.post<{message: string, table: Table}>("http://localhost:3000/api/tables", table)
        .subscribe(resData => {
          console.log(resData.message);
          console.log("Created table: ");
          console.log(table);
          this.getTables();
          this.tableEvents.next("Create");
          this.error.next("ok");
          this.tablesUpdated.next([...this.tables]);
      }, error => {
        if (error.error.message === "Same Number") {
          this.error.next(error.error.message);
        }
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
        .subscribe(() => {
          this.tables[tableIndex].orders.splice(orderIndex, 1);
          this.tablesUpdated.next([...this.tables]);
    });
  }

  deleteTable(table: Table) {
    this.http.delete<{message: string}>("http://localhost:3000/api/tables/" + table._id)
      .subscribe(res => {
        console.log(res.message);
        this.getTables();
        this.tableEvents.next("Delete");
        this.tablesUpdated.next([...this.tables]);
      });
  }
}