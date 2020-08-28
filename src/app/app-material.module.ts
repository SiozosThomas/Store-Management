import { NgModule } from "@angular/core";
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {MatPaginatorModule} from '@angular/material/paginator'; 

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        MatCheckboxModule,
        MatTableModule,
        NgxUiLoaderModule,
        MatPaginatorModule
    ],
    exports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        MatCheckboxModule,
        MatTableModule,
        NgxUiLoaderModule,
        MatPaginatorModule
    ]
})
export class AppMaterialModule {}