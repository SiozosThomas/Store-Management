import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProductsComponent } from '../products.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  addProductForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProductsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {data: FormGroup}) { }

  ngOnInit(): void {
    this.addProductForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'price': new FormControl(null, [Validators.required, Validators.min(0)])
    });
  }

  onSubmit(): void {
    this.dialogRef.close({data: this.addProductForm});
  }
  
  cancel() {
    this.dialogRef.close();
  }

}
