import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {MatTableModule} from '@angular/material/table';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TableListComponent } from './table-list/table-list.component';
import { AddDialogComponent } from './table-list/dialog/add-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NewTableComponent } from './new-table/new-table.component';
import { ProductsComponent } from './products/products.component';
import { DialogComponent } from './products/dialog/dialog.component';
import { AuthComponent } from './auth/auth.component';
import { FooterComponent } from './footer/footer.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'tables-list', component: TableListComponent, canActivate: [AuthGuard]},
  { path: 'newTable', component: NewTableComponent, canActivate: [AuthGuard]},
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TableListComponent,
    AddDialogComponent,
    NewTableComponent,
    ProductsComponent,
    DialogComponent,
    AuthComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    CardModule,
    ButtonModule,
    HttpClientModule,
    MatDialogModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    MatTableModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
