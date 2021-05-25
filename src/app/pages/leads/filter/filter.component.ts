import { Source } from './../../sourcechart/source-filter/source-filter.component';
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { map, startWith, take, tap } from 'rxjs/operators';
import { DateService } from '../../../service/date.service';
import { LeadApiService } from 'src/app/services/lead-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
} from 'rxjs';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';
export interface createContact {
  id: any;
  name: string;
  isChecked?: boolean;
}
export interface createCompany {
  id: any;
  name: string;
  isChecked?: boolean;
}
// multi autocomplete
export class Contact {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

/*export class Source {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}*/

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnChanges {
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;

  // @Input() filterCount:number
  @Output() filterCountChanged: EventEmitter<number> = new EventEmitter();
  @Input() listShow: boolean;
  @Output() closeDialog = new EventEmitter();
  @Output() count = new EventEmitter<any>();
  @Input() canShow;
  contactCtrl = new FormControl();
  companyCtrl = new FormControl();
  filteredCont: Observable<createContact[]>;
  filteredComp: Observable<createCompany[]>;
  selectedCreatedBy: createContact[] = [];
  selectedCompany: createCompany[] = [];
  filterCount: number = 0;
  myControl = new FormControl();
  searchOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  dateFrom="";
  dateTo="";

  //@Output() public notifyParent: EventEmitter<any> = new EventEmitter();
  @Output() messageEvent = new EventEmitter<any>();

  callParent() {
    console.log("ok-changed");
    let arrSource = []; let arrCompany = []; let arrContacts = []
    this.sources.forEach((e) => {
      e.selected && arrSource.push(e.id);
    });
    this.selectedCreatedBy.forEach((e) => {
      arrContacts.push(e.id);
    });
    this.selectedCompany.forEach((e) => {
      arrCompany.push(e.id);
    });
    let obj = {
      lead_value:{
        min: this.minValue,
        max: this.highValue,
      }
    };
    if(arrSource.length > 0){
      obj['source'] = arrSource;
    }
    if(arrContacts.length > 0){
      obj['contact_users'] = arrContacts;
    }
    if(arrCompany.length > 0){
      obj['contact_organization'] = arrCompany;
    }
    if(this.statusType != "" && typeof this.statusType != 'undefined'){
      obj['status'] = [this.statusType];
    }
    if(this.dateFrom != "" && this.dateTo != ""){
      obj['modified'] = {
        from: this.dateFrom,
        to: this.dateTo
      };
    }
    this.messageEvent.emit(obj);
  }

  minValue: number = 100;
  highValue: number = 9000;
  sliderOptions: Options = {
    floor: 0,
    ceil: 100000,
  };

  contactActive: number = 0;

  selectedPipe: string[] = [];

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6];
  dateTypeString: string[] = [
    'Today',
    'Yesterday',
    'Last Week',
    'This month',
    'Last month',
    'This Quarter',
    'Custom',
  ];
  dateType: number;

  statusType: string = '';
  selectedSource: string[] = [];

  public startDate: Date = null;
  public endDate: Date = null;

  scrollOptions = { autoHide: true, scrollbarMinSize: 30 };
  selectedDisplay = 'pipe1';
  // multi autocomplete

  sources = [];
  sourceAll: boolean = false;

  createdBySelection(contact: createContact) {
    console.log("createdBySelection");
    console.log(contact);
    if (contact.isChecked) {
      this.selectedCreatedBy = [...this.selectedCreatedBy, contact];
    } else {
      let index = this.selectedCreatedBy.findIndex(
        (c) => c.name === contact.name
      );
      this.selectedCreatedBy.splice(index, 1);
    }
    this.callParent();
  }
  companySelection(contact: createCompany) {
    if (contact.isChecked) {
      this.selectedCompany = [...this.selectedCompany, contact];
    } else {
      let index = this.selectedCompany.findIndex(
        (c) => c.name === contact.name
      );
      this.selectedCompany.splice(index, 1);
    }
    this.callParent();
  }

  contacts: createContact[] = [
    {
      id: 0,
      name: 'Arkansas',
    },
    {
      id: 1,
      name: 'California',
    },
    {
      id: 2,
      name: 'Florida',
    },
    {
      id: 3,
      name: 'Texas',
    },
  ];

  companys: createCompany[] = [
    {
      id: 0,
      name: 'Company 1',
    },
    {
      id: 0,
      name: 'Company 2',
    },
    {
      id: 0,
      name: 'Company 3',
    },
    {
      id: 0,
      name: 'Company 4',
    },
  ];

  status: any[] =  [];
  leadValue: any[] = [];

  constructor(
    private dateService: DateService,
    private sb: SnackBarService,
    private LeadApiService: LeadApiService
  ) {
    console.log("constrctor start");
    console.log(this.filteredCont);
  }
  ngOnChanges(){
    console.log("ngOnchanges");
  }
  ngOnInit(): void {
    console.log("child_component");
    this.LeadApiService.getFilterValues().subscribe(
      (res: any) => {
        if (res.success) {
          console.log(res);
          this.contacts = [];
          res.data.contacts.users.forEach(element => {
            this.contacts.push({
              id: element.id,
              name: element.full_name,
            });
          });
          this.companys = res.data.contacts.organizations;
          this.minValue = res.data.lead_value.min;
          this.highValue = res.data.lead_value.max;
          this.sources = res.data.source;
          this.status = res.data.status;
          this.leadValue = res.data.lead_value;
          this.triggerSnackBar(res.message, 'Close');
          console.log(this.contacts);
          console.log(this.companys);
          this.filteredCont = this.contactCtrl.valueChanges.pipe(
            startWith(''),
            map((state) =>
              state ? this._filterStates(state) : this.contacts.slice()
            )
          );
          console.log("after",this.filteredCont);
          this.filteredComp = this.companyCtrl.valueChanges.pipe(
            startWith(''),
            map((state) =>
              state ? this._filterStatesComp(state) : this.companys.slice()
            )
          );
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }

  calculateFilterCount(): number {
    this.filterCount = 0;
    if (this.statusType) {
      this.filterCount += 1;
    }
    if (this.selectedCreatedBy.length > 0) {
      this.filterCount += 1;
    }
    if (this.selectedCompany.length > 0) {
      this.filterCount += 1;
    }
    if (this.dateType != -1 && (this.dateType || this.dateType == 0)) {
      this.filterCount += 1;
    }
    if (this.getSelectedSource() != '') {
      this.filterCount += 1;
    }
    if (this.selectedPipe.length > 0) {
      this.filterCount += 1;
    }
    if (this.minValue != null && this.highValue != null) {
      this.filterCount += 1;
    }
    this.count.emit(this.filterCount);
    //this.callParent();
    return this.filterCount;
  }

  clearAll() {
    this.clearStatus('clearAll');
    this.clearCreatedBy('clearAll');
    this.clearCompany('clearAll');
    this.clearDate('clearAll');
    this.clearSource('clearAll');
    this.clearPipe('clearAll');
    this.clearValueClick('clearAll');
    this.callParent();
  }

  public clearSource(type = "") {
    this.sources.forEach((e) => {
      e.selected = false;
    });
    this.sourceAll = false;
    if(type == ""){
      this.callParent();
    }
  }
  public clearDate(type = "") {
    this.dateType = -1;
    this.dateFrom = "";
    this.dateTo = "";
    if(type == ""){
      this.callParent();
    }
  }

  public clearStatus(type = "") {
    this.statusType = undefined;
    if(type == ""){
      this.callParent();
    }
  }

  public clearPipe(type = "") {
    this.selectedPipe = [];
    if(type == ""){
      this.callParent();
    }
  }

  public clearCreatedBy(type = "") {
    this.selectedCreatedBy = [];
    this.filteredCont
      .pipe(
        tap((data) => {
          data.forEach((c) => {
            c.isChecked = false;
          });
        }),
        take(1)
      )
      .subscribe();
      if(type == ""){
        this.callParent();
      }
  }

  public clearCompany(type = "") {
    this.selectedCompany = [];
    this.filteredComp
      .pipe(
        tap((data) => {
          data.forEach((c) => {
            c.isChecked = false;
          });
        }),
        take(1)
      )
      .subscribe();
      if(type == ""){
        this.callParent();
      }
  }

  displayFn(value: Contact[] | string): string | undefined {
    return '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public clearValueClick(type="") {
    this.minValue = this.leadValue['min'];
    this.highValue = this.leadValue['max'];
    if(type == ""){
      this.callParent();
    }
  }

  public clickDiscovery(item) {
    const index = this.selectedPipe.indexOf(item, 0);
    if (index > -1) {
      this.selectedPipe.splice(index, 1);
    } else {
      this.selectedPipe.push(item);
    }
  }

  public checkPipe(item) {
    const index = this.selectedPipe.indexOf(item, 0);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  //source
  public sourceSelect(source) {
    source.selected = !source.selected;
    this.sourceAll =
      this.sources != null && this.sources.every((t) => t.selected);
    this.callParent();
  }

  //source
  public allSourceSelect(event) {
    const checked = event.checked;
    this.sources.forEach((e) => (e.selected = checked));
    this.callParent();
  }

  //source
  getSelectedSource() {
    let arr = [];
    this.sources.forEach((e) => {
      e.selected && arr.push(e.name);
    });
    return this.displayArray(arr);
  }

  public displayArray(arr) {
    let ret = '';
    arr.length == 1 && (ret += arr[0]);
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1]);
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2));
    return ret;
  }

  changeLastmodified(type){
    //alert(this.dateType);
    //alert(type);
    if (this.dateType == -1) {
      return '';
    }
    let date = "";
    switch (type) {
      case 0:
        const today = this.dateService.getToday();
        this.dateFrom = today;
        this.dateTo = today;
        this.callParent();
        return today + ' ~ ' + today;
      case 1:
        const yesterday = this.dateService.getYesterday();
        this.dateFrom = yesterday;
        this.dateTo = yesterday;
        this.callParent();
        return yesterday + ' ~ ' + yesterday;
      case 2:
        date =  this.dateService.getLastWeek();
      case 3:
        date = this.dateService.getThisMonth();
      case 4:
        date =  this.dateService.getLastMonth();
      case 5:
        date =  this.dateService.getThisQuarter();
      case 6:
        let firstDay = '',
          lastDay = '';
        this.startDate &&
          (firstDay = this.dateService.dateToString(this.startDate));
        this.endDate && (lastDay = this.dateService.dateToString(this.endDate));
        this.dateFrom = firstDay;
        this.dateTo = lastDay;
        this.callParent();
        return firstDay + ' ~ ' + lastDay;
    }
    let dateArray = date.split("~");
    this.dateFrom = dateArray[0];
    this.dateTo = dateArray[1];
    this.callParent();
    return date;
  }

  public getSelectedDate() {
    //console.log(this.dateType);
    if (this.dateType == -1) {
      return '';
    }
    switch (this.dateType) {
      case 0:
        const today = this.dateService.getToday();
        return today + ' ~ ' + today;
      case 1:
        const yesterday = this.dateService.getYesterday();
        return yesterday + ' ~ ' + yesterday;
      case 2:
        return this.dateService.getLastWeek();
      case 3:
        return this.dateService.getThisMonth();
      case 4:
        return this.dateService.getLastMonth();
      case 5:
        return this.dateService.getThisQuarter();
      case 6:
        let firstDay = '',
          lastDay = '';
        this.startDate &&
          (firstDay = this.dateService.dateToString(this.startDate));
        this.endDate && (lastDay = this.dateService.dateToString(this.endDate));
        return firstDay + ' ~ ' + lastDay;
    }
  }

  private _filterStates(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.contacts.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterStatesComp(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.companys.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
}
