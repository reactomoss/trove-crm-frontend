import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateService } from '../../../service/date.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';

export interface CompanyFilters {
  count: number;
  state: string;
  activity: number;
  addedon: number
}

export class Type {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
export interface createContact {
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
  selector: 'company-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class CompanyFilterComponent implements OnInit {

  @Output() closeDialog = new EventEmitter();
  @Output() notifyFilters = new EventEmitter<CompanyFilters>();
  contactCtrl = new FormControl();
  companyCtrl = new FormControl();
  filteredCont: Observable<createContact[]>;
  selectedCreatedBy: createContact[] = [];
  statusTypes: string[] = ['All', 'Active', 'Inactive']
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  filters: CompanyFilters = {
    count: 0, 
    state: '', 
    activity: -1,
    addedon: -1,
  }

  createdBySelection(contact: createContact){
    console.log('createdBySelection', contact)
    if (contact.isChecked) {
      this.selectedCreatedBy = [...this.selectedCreatedBy, contact]
    }
    else {
      let index = this.selectedCreatedBy.findIndex(c => c.name === contact.name);
      this.selectedCreatedBy.splice(index,1);
    }
  }

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number
  startDate: Date = null
  endDate: Date = null

  addDateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  addDateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  addStartDate: Date = null
  addEndDate: Date = null

  contactType: string = 'contact'

  contacts: createContact[] = [
    {
      name: 'Arkansas',
    },
    {
      name: 'California'
    },
    {
      name: 'Florida'
    },
    {
      name: 'Texas'
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
  }

  ngOnInit(): void {

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
    switch (this.filters.activity) {
      case 0:
        const today = this.dateService.getToday()
        return today + ' ~ ' + today
      case 1:
        const yesterday = this.dateService.getYesterday()
        return yesterday + ' ~ ' + yesterday
      case 2:
        return this.dateService.getLastWeek()
      case 3:
        return this.dateService.getThisMonth()
      case 4:
        return this.dateService.getLastMonth()
      case 5:
        return this.dateService.getThisQuarter()
      case 6:
        let firstDay = '', lastDay = ''
        this.startDate && (firstDay = this.dateService.dateToString(this.startDate))
        this.endDate && (lastDay = this.dateService.dateToString(this.endDate))
        return firstDay + ' ~ ' + lastDay
    }
  }

  public getAddSelectedDate() {
    if (this.filters.addedon == -1) {
      return ''
    }
    switch (this.filters.addedon) {
      case 0:
        const today = this.dateService.getToday()
        return today + ' ~ ' + today
      case 1:
        const yesterday = this.dateService.getYesterday()
        return yesterday + ' ~ ' + yesterday
      case 2:
        return this.dateService.getLastWeek()
      case 3:
        return this.dateService.getThisMonth()
      case 4:
        return this.dateService.getLastMonth()
      case 5:
        return this.dateService.getThisQuarter()
      case 6:
        let firstDay = '', lastDay = ''
        this.addStartDate && (firstDay = this.dateService.dateToString(this.addStartDate))
        this.addEndDate && (lastDay = this.dateService.dateToString(this.addEndDate))
        return firstDay + ' ~ ' + lastDay
    }
  }

  calculateFilterCount(): number {
    let filterCount = 0;
    if (this.filters.state) {
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
    this.clearDate();
    this.clearAddDate();
  }

  clearType() {
    this.types.forEach(e => {
      e.selected = false;
    })
  }

  public clearStatus() {
    this.filters.state = '';
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
    this.filters.state = e.value
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

  private notify() {
    this.filters.count = this.calculateFilterCount()
    this.notifyFilters.emit(this.filters);
  }

  private _filterStates(value: string): createContact[] {
    const filterValue = value.toLowerCase();
    return this.contacts.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
