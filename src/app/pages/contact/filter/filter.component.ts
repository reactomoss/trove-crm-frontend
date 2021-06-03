import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateService } from '../../../service/date.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, startWith, take, tap } from 'rxjs/operators';

export interface ContactFilters {
  count: number
  status: string
  activity: number
  activityStartDate: Date
  activityEndDate: Date
  addedon: number
  addedonStartDate: Date
  addedonEndDate: Date
  owners: number[]
}

export class Type {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
export interface createContact {
  id: number;
  name: string;
  isChecked?: boolean;
}
export interface createCompany {
  name: string;
  isChecked?: boolean;
}
// multi autocomplete
export class Contact {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'contact-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class ContactFilterComponent implements OnInit {
  @Input() owners = null;
  @Output() closeDialog = new EventEmitter();
  @Output() notifyFilters = new EventEmitter<ContactFilters>();
  contactCtrl = new FormControl();
  companyCtrl = new FormControl();
  filteredCont: Observable<createContact[]>;
  filteredComp: Observable<createCompany[]>;
  selectedCreatedBy: createContact[] = [];
  selectedCompany: createCompany[] = [];
  status: string
  statusTypes: string[] = ['All', 'Active', 'Inactive']
  filterCount: number = 0
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  filters: ContactFilters = {
    count: 0, 
    status: null, 
    activity: -1,
    activityStartDate: null,
    activityEndDate: null,
    addedon: -1,
    addedonStartDate: null,
    addedonEndDate: null,
    owners: [],
  }
  dateFormat = 'DD/MM/YYYY'

  createdBySelection(contact: createContact){
    console.log('createdBySelection', contact)
    if (contact.isChecked) {
      this.selectedCreatedBy = [...this.selectedCreatedBy, contact]
    }
    else {
      let index = this.selectedCreatedBy.findIndex(c => c.name === contact.name);
      this.selectedCreatedBy.splice(index,1);
    }
    this.filters.owners = this.selectedCreatedBy.map(item => item.id)
    this.notify()
  }
  companySelection(contact: createCompany){
    if(contact.isChecked) {
      this.selectedCompany = [...this.selectedCompany, contact]
    }else {
      let index = this.selectedCompany.findIndex(c => c.name === contact.name);
      this.selectedCompany.splice(index,1);
    }
  }

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number
  startDate: Date = null
  endDate: Date = null

  addDateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  addDateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  addDateType: number
  addStartDate: Date = null
  addEndDate: Date = null

  contactType: string = 'contact'
  contacts: createContact[] = [];
  companys: createCompany[] = [
    {
      name: 'Company 1',
    },
    {
      name: 'Company 2'
    },
    {
      name: 'Company 3'
    },
    {
      name: 'Company 4'
    }
  ];

  types: Type[] = [
    new Type('Added by user'),
    new Type('Import from CSV'),
    new Type('Google contacts'),
    new Type('Twitter contacts'),
    new Type('Outlook contacts')
  ]

  // multi autocomplete

  constructor(private dateService: DateService) {
    this.filteredCont = this.contactCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.contacts.slice())
      );
    //   this.filteredComp = this.companyCtrl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(state => state ? this._filterStatesComp(state) : this.companys.slice())
    //   );
  }


  ngOnInit(): void {
    this.contacts = this.owners.map(owner => {
      return { id: owner.id, name: owner.full_name }
    })
  }

  public displayArray(arr) {
    let ret = ''
    arr.length == 1 && (ret += arr[0])
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1])
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2))
    return ret
  }

  clickType(e, type) {
    type.selected = e.checked
  }

  displaySelectedTypes() {
    let arr = []
    this.types.forEach(e => {
      e.selected && arr.push(e.name)
    })
    return this.displayArray(arr)
  }

  public getSelectedDate() {
    if (this.filters.activity == -1) {
      return ''
    }
    if (this.filters.activity == 6) {
      let firstDay = '', lastDay = ''
      this.filters.activityStartDate && (firstDay = this.dateService.dateToString(this.filters.activityStartDate))
      this.filters.activityEndDate && (lastDay = this.dateService.dateToString(this.filters.activityEndDate))
      return firstDay + ' ~ ' + lastDay   
    }
    const {startDate, lastDate} = this.dateService.getDateRange(this.filters.activity)
    return startDate.format(this.dateFormat) + '~' + lastDate.format(this.dateFormat)
  }

  public getAddSelectedDate() {
    if (this.filters.addedon == -1) {
      return ''
    }
    if (this.filters.activity == 6) {
      let firstDay = '', lastDay = ''
      this.filters.addedonStartDate && (firstDay = this.dateService.dateToString(this.filters.addedonStartDate))
      this.filters.addedonEndDate && (lastDay = this.dateService.dateToString(this.filters.addedonEndDate))
      return firstDay + ' ~ ' + lastDay   
    }
    const {startDate, lastDate} = this.dateService.getDateRange(this.filters.addedon)
    return startDate.format(this.dateFormat) + '~' + lastDate.format(this.dateFormat)
  }

  calculateFilterCount(): number {
    let filterCount = 0;
    if (this.filters.status) {
      filterCount += 1;
    }
    if (this.selectedCreatedBy.length > 0) {
      filterCount += 1;
    }
    if (this.filters.activity != -1 && (this.filters.activity || this.filters.activity == 0)) {
      filterCount += 1;
    }
    if (this.filters.addedon != -1 && (this.filters.addedon || this.filters.addedon == 0)) {
      filterCount += 1;
    }
    if (this.displaySelectedTypes() != '') {
      filterCount += 1;
    }
    return filterCount;
  }

  clearAll() {
    this.clearType();
    this.clearStatus();
    this.clearCreatedBy();
    this.clearCompany();
    this.clearDate();
    this.clearAddDate();
  }

  clearType() {
    this.types.forEach(e => {
      e.selected = false;
    })
  }

  public clearStatus() {
    this.filters.status = null;
    this.notify()
  }

  public clearCreatedBy() {
    this.selectedCreatedBy = [];
    this.filteredCont.pipe(
      tap(data => {
        data.forEach(c => {
          c.isChecked = false;
        })
      }),
      take(1)
    ).subscribe();
  }

  public clearCompany() {
    this.selectedCompany = [];
    this.filteredComp.pipe(
      tap(data => {
        data.forEach(c => {
          c.isChecked = false;
        })
      }),
      take(1)
    ).subscribe();
  }

  public clearDate() {
    this.filters.activity = -1
    this.notify()
  }

  public clearAddDate() {
    this.filters.addedon = -1
    this.notify()
  }

  public stateFilterChanged(e) {
    console.log('stateFilterChanged', e)
    this.filters.status = e.value
    this.notify()
  }

  public activityFilterChanged(e) {
    console.log('activityFilterChanged', e)
    this.filters.activity = e.value
    this.notify()
  }

  public addedonFilterChanged(e) {
    console.log('addedonFilterChanged', e)
    this.filters.addedon = e.value
    this.notify()
  }

  public notify() {
    this.filters.count = this.calculateFilterCount()
    this.notifyFilters.emit(this.filters);
  }

  public closeFilterDilaog() {
    this.closeDialog.emit(this.filters)
  }

  private _filterStates(value: string): createContact[] {
    const filterValue = value.toLowerCase();
    return this.contacts.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterStatesComp(value: string): createContact[] {
    //const filterValue = value.toLowerCase();
    //return this.companys.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    return null //TODO
  }
}

