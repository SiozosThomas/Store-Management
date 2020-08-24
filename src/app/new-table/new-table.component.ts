import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TablesService } from '../table-list/tables.service';
import { Table } from '../table-list/table.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.css']
})
export class NewTableComponent implements OnInit {

  newTableForm: FormGroup;

  constructor(private tablesService: TablesService,
      private router: Router) { }

  ngOnInit(): void {
    this.newTableForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'number': new FormControl(null, [Validators.required, Validators.min(0)])
    });
  }

  onSubmit(): void {
    console.log(this.newTableForm.controls.name.value);
    
    const table: Table = ({
      name: this.newTableForm.controls.name.value,
      number: this.newTableForm.controls.number.value
    });
    this.tablesService.addTable(table);
    this.router.navigate(['/']);
  }
}
