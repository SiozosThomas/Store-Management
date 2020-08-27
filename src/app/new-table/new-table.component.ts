import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TablesService } from '../table-list/tables.service';
import { Table } from '../table-list/table.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.css']
})
export class NewTableComponent implements OnInit, OnDestroy {

  newTableForm: FormGroup;
  sameNumberError = false;
  errorSub: Subscription;

  constructor(private tablesService: TablesService,
      private router: Router) { }

  ngOnInit(): void {
    this.newTableForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'number': new FormControl(null, [Validators.required, Validators.min(0)])
    });
    this.errorSub = this.tablesService.getErrorListener().subscribe();
  }

  onSubmit(): void {
    console.log(this.newTableForm.controls.name.value);
    
    const table: Table = ({
      name: this.newTableForm.controls.name.value,
      number: this.newTableForm.controls.number.value
    });
    this.tablesService.addTable(table);
    this.errorSub = this.tablesService.getErrorListener()
      .subscribe(error => {
        if (error === "Same Number") {
          this.sameNumberError = true;
        } else if (error == "ok") {
          this.router.navigate(['/tables-list']);
        }
      });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
