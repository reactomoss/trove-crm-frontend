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
export interface Paginator {
  pageIndex: number;
  pageSize: number;
  lowValue: number;
  highValue: number;
}

@Component({
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.css']
})
export class CompanyTableComponent implements AfterViewInit {

  @Input() propItems
  @Input() selectedItems
  @Output() pagination = new EventEmitter();

  displayedColumns: string[] = ['contact', 'last', 'since', 'city', 'added', 'type', 'status', 'phone'];
  dataSource
  selectedTh: string = ''
  private paginatorData: Paginator = { pageIndex: 0, pageSize: 10, lowValue: 0, highValue: -1};

  constructor(private dateService: DateService, private router: Router) {
    this.dataSource = new MatTableDataSource(this.propItems);
  }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.propItems)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.propItems)
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
    console.log('pageChanged', event)
    //this.pagination.emit(e)

    if (event.pageIndex === this.paginatorData.pageIndex + 1) {
      this.paginatorData.lowValue = this.paginatorData.lowValue + this.paginatorData.pageSize;
      this.paginatorData.highValue = this.paginatorData.highValue + this.paginatorData.pageSize;
    }
    else if (event.pageIndex === this.paginatorData.pageIndex - 1) {
      this.paginatorData.lowValue = this.paginatorData.lowValue - this.paginatorData.pageSize;
      this.paginatorData.highValue = this.paginatorData.highValue - this.paginatorData.pageSize;
    }
    this.paginatorData.pageIndex = event.pageIndex;
    //this.timer = setTimeout(() => { this.fetchOneArticle(this.dataSource) });
    console.log('*** getPaginatorData -> ' + JSON.stringify(this.paginatorData));
  }

  private fetchOneArticleByID(url, id) {
    console.log('fetchOneArticleByID', url, id)
  }
}
