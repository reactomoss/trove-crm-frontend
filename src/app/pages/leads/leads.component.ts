import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LeadApiService } from 'src/app/services/lead-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
  Subject,
} from 'rxjs';
import { SnackBarService } from '../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
})
export class LeadsComponent implements OnInit, AfterViewInit {

  @ViewChild(FilterComponent) child: FilterComponent;

  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  showFilter: boolean = false;
  listShow: boolean = false;
  stages: string[] = [
    'Discovery',
    'Qualified',
    'Evolution',
    'Negotiation',
    'Closed',
  ];

  discovery: number[] = [100, 2, 3, 4, 5];
  qualified: number[] = [1, 2];
  evolution: number[] = [1];
  negotiation: number[] = [1];
  closed: number[] = [1, 2, 3];

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  active: number = 1;

  filterCount: number = 0;
  viewLeads = 'pipe1';
  constructor(
    private router: Router,
    private sb: SnackBarService,
    private LeadApiService: LeadApiService,
    private cdref: ChangeDetectorRef
  ) {}

  currentSelectedPipeline = "";
  pipelineMaster = [];
  totalLead = 0;
  totalValue = 0;
  avgValue = 0

  Leads: Observable<any[]>;
  StagesForDrag = [];
  connectedTo = [];
  canShow = true;
  filterObj$ = {};
  //filterObj$ = new BehaviorSubject<any>({});
  searchValue = "";
  private searchText$ = new Subject<string>();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  ngOnChanges(){
    console.log("changed");
    console.log(this.child.minValue);
  }
  ngAfterViewInit(){
    console.log("ngAfterViewInit");
  }

  ngOnInit(): void {
    this.triggerSnackBar("ngOninit", "Close");
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.LeadApiService.getPipelines().subscribe(
      (res: any) => {
        if (res.success) {
          console.log(res);
          this.pipelineMaster = res.data.pipelines;
          this.currentSelectedPipeline = this.pipelineMaster[0].id;
          this.listLeadGridView();
          this.triggerSnackBar(res.message, 'Close');
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
  receiveMessage($event){
    console.log("anyParentMehtod");
    console.log($event);
    this.filterObj$ = $event;
    //this.filterObj$.next($event);
    this.listLeadGridView();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public activeClass(num) {
    if (num == this.active) return 'activeBtn';
    else return '';
  }

  public setActive(num) {
    console.log('set active', num);
    this.active = num;
    if (num == 1) {
      this.options = ['One', 'Two', 'Three'];
    } else if (num == 2) {
      this.options = ['Four', 'Five', 'Six'];
    } else if (num == 3) {
      this.options = ['Seven', 'Eight', 'Nine'];
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  public onSelectionChange(event) {
    console.log(event.option.value);
  }

  showList() {
    this.listShow = true;
  }

  showCards() {
    this.listShow = false;
    this.showFilter = false;
  }

  dropped(id, event: CdkDragDrop<string[]>) {
    //alert(id);
    //console.log(event);
    //console.log(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer === event.container) {
      alert("if");
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log("else");
      console.log(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      console.log("Moved Data is", event.previousContainer.data[event.currentIndex]);
      let lead_id = event.previousContainer.data[event.currentIndex]['id'];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.LeadApiService.changeLeadStage(lead_id, id).subscribe(
        (res: any) => {
          if (res.success) {
            console.log(res);
            this.triggerSnackBar(res.message, 'Close');
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
  }

  clickCard() {
    this.router.navigate(['/pages/lead_detail']);
  }

  filterCountChangedHandler(e) {
    alert("filterCountChangedHandler");
    this.filterCount = e;
    alert(this.child.minValue);
  }

  clickFilter() {
    this.showFilter = true;
  }

  onPipelineChange(){
    this.listLeadGridView();
  }

  search(searchvalue: string) {
    this.searchText$.next(searchvalue);
  }

  listLeadGridView(){
    //alert(this.currentSelectedPipeline);
    this.StagesForDrag = [];
    console.log(this.filterObj$);
    /*this.Leads = combineLatest(this.filterObj$)
      .pipe(
        // startWith([undefined, ]),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          alert("Yen call agala?");
          return this.LeadApiService.listLeadGridView(this.filterObj$);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.data.recordsTotal;
          this.triggerSnackBar(data.message, 'Close');
          if(data.data.data.length > 0){
            this.canShow = true;
            console.log("listLeadGridView");
            console.log(data);
            console.log(this.Leads);
            this.totalLead = data.data.summary.total_leads;
            this.totalValue = data.data.summary.total_value;
            this.avgValue = data.data.summary.lead_average;
          } else {
            this.canShow = false;
            this.triggerSnackBar('No Records found', 'Close');
          }

          return data.data.data;
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          console.log(err);
          return observableOf([]);
        })
      );*/

    this.filterObj$['pipeline_id'] = this.currentSelectedPipeline;
    this.filterObj$['search'] = this.searchValue;
    //this.filterObj$.next(this.filterObj$);
    this.LeadApiService.listLeadGridView(this.filterObj$).subscribe(
      (res: any) => {
        if (res.success) {
          this.triggerSnackBar(res.message, 'Close');
          if(res.data.data.length > 0){
            this.Leads = res.data.data;
            console.log("listLeadGridView");
            console.log(res);
            console.log(this.Leads);
            this.totalLead = res.data.summary.total_leads;
            this.totalValue = res.data.summary.total_value;
            this.avgValue = res.data.summary.lead_average;
            this.Leads.forEach((e) => {
              let leadList = [];
              e['leads'].forEach(element => {
                //leadList.push(element.name);
                leadList.push({
                  id: element.id,
                  name: element.name,
                  organizations_name: element.organizations.name,
                  currency_symbol: element.currency.symbol,
                  currency_value: element.currency_value,
                  owner_full_name: element.owner.full_name,
                  created_at: element.created_at,
                });
              });
              this.StagesForDrag.push({
                id: e['id'],
                idref: "Lead-"+e['id'],
                name: e['name'],
                lead_list: leadList,
              });
            });
            for (let stage of this.StagesForDrag) {
              this.connectedTo.push(stage.idref);
            };
            this.canShow = true;
            console.log("stagesList");
            console.log(this.StagesForDrag);
          } else {
            this.canShow = false;
            this.triggerSnackBar('No Records found', 'Close');
          }
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

  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  compareFunction(o1: any, o2: any) {
    return (o1 == o2);
   }
}
