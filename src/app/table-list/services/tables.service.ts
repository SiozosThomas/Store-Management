import { Injectable } from "@angular/core";
import { Table } from "../models/table.model";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/tables";

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
      this.http.get<{message: string, tables: Table[]}>(BACKEND_URL)
      .subscribe((data) => {
        this.tables = data.tables;
        this.tablesUpdated.next([...this.tables]);
    });
  }

  addTable(table: Table) {
      this.http.post<{message: string, table: Table}>(BACKEND_URL, table)
        .subscribe(resData => {
          console.log(resData.message);
          console.log("Created table: ");
          console.log(table);
          this.tableEvents.next("Create");
          this.getTables();
          this.error.next("ok");
          this.tablesUpdated.next([...this.tables]);
      }, error => {
        if (error.error.message === "Same Number") {
          this.error.next(error.error.message);
        }
      });
  }

  updateTable(table: Table, numberUpdated: boolean) {
    this.http.patch<{message: string, table: Table}>(BACKEND_URL + "/" + table._id + "/" + numberUpdated, table)
      .subscribe(resData => {
        console.log(resData.message);
        this.getTables();
        this.tablesUpdated.next([...this.tables]);
    }, error => {
      if (error.error.message === "Same Number") {
        this.tableEvents.next("SameNumber");
      }
    });
}

  addProduct(order: Order) {
    const request = this.http.post<{message: string, order: Order}>(BACKEND_URL + "/addOrder", order);
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
    this.http.delete<{message: string}>(BACKEND_URL + "/" + order._id + "/" + table._id)
        .subscribe(() => {
          this.tables[tableIndex].orders.splice(orderIndex, 1);
          this.tablesUpdated.next([...this.tables]);
    });
  }

  deleteTable(table: Table) {
    this.http.delete<{message: string}>(BACKEND_URL + "/" + table._id)
      .subscribe(res => {
        console.log(res.message);
        this.getTables();
        this.tableEvents.next("Delete");
        this.tablesUpdated.next([...this.tables]);
      });
  }
}