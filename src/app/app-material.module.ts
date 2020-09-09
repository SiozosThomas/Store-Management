import { NgModule } from "@angular/core";
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        MatCheckboxModule,
        MatTableModule,
        NgxUiLoaderModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatExpansionModule
    ],
    exports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        MatCheckboxModule,
        MatTableModule,
        NgxUiLoaderModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatExpansionModule
    ]
})
export class AppMaterialModule {}