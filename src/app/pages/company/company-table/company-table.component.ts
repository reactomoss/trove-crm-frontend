import { Component, OnInit, Input, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateService } from '../../../service/date.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

export interface item {
  name: string;
  owner: string;
  contactCount: number;
  email: string;
  companyName: string;
  company: boolean;
  last: Date;
}
@Component({
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.css']
})
export class CompanyTableComponent implements AfterViewInit {
 
  @Input() length
  @Input() pageSize
  @Input() propItems
  @Input() selectedItems
  @Output() pagination = new EventEmitter();

  displayedColumns: string[] = ['contact', 'last', 'since', 'city', 'added', 'type', 'status', 'phone'];
  dataSource
  selectedTh: string = ''
  items = []
  page = null

  constructor(private dateService: DateService, private router: Router) {
      
  }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
      
  }

  ngOnChanges() {
    console.log('ngOnChanges', this.propItems)
    this.items = [...this.propItems]
    if (this.items.length < this.length) {
      this.items.push({})
    }
    this.dataSource = new MatTableDataSource(this.items)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  clickCheck(event, item) {
    event.preventDefault()
    const index = this.selectedItems.indexOf(item, 0);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item)
    }
    console.log(this.selectedItems)
  }

  setCheckStatus(item) {
    const index = this.selectedItems.indexOf(item, 0);
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  dateToString(date) {
    return this.dateService.dateToString(date)
  }

  clickTh(th) {
    this.selectedTh = th
  }

  clickItem(item) {
    this.router.navigate(['/pages/company_detail'])
  }
  
  pageChanged(event) {
    this.page = event
    this.pagination.emit(event)
  }
}
