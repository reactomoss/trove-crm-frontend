import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  avatar: string;
  name: string;
  stage: string;
  value: number;
  day: number;
  owner: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', stage: 'Qualified', value: 0, day: 1, owner: 'Packet Monster, Inc.' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', stage: 'Evolution', value: 400, day: 1, owner: '' },
];


@Component({
  selector: 'app-lead-table',
  templateUrl: './lead-table.component.html',
  styleUrls: ['./lead-table.component.css']
})
  
export class LeadTableComponent implements AfterViewInit  {
  displayedColumns: string[] = ['avatar', 'name', 'stage', 'value', 'day', 'owner'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() { }

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngAfterViewInit (): void {
    this.dataSource.sort = this.sort;
  }

}
