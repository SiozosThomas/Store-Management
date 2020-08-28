import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { TableListComponent } from './table-list/table-list.component';
import { NewTableComponent } from './new-table/new-table.component';
import { ProductsComponent } from './products/products.component';

const appRoutes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'tables-list', component: TableListComponent, canActivate: [AuthGuard] },
    { path: 'newTable', component: NewTableComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    
}

