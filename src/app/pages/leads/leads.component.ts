import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
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
} from 'rxjs';
import { SnackBarService } from '../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
})
export class LeadsComponent implements OnInit {
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

  Leads = [];
  canShow = false;

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
          this.listLeadGridView(this.currentSelectedPipeline);
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

  dropped(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  clickCard() {
    this.router.navigate(['/pages/lead_detail']);
  }

  filterCountChangedHandler(e) {
    this.filterCount = e;
  }

  clickFilter() {
    this.showFilter = true;
  }

  onPipelineChange(pipeline_id){
    this.listLeadGridView(pipeline_id);
  }

  listLeadGridView(pipeline_id){
    alert(pipeline_id);
    this.LeadApiService.listLeadGridView(pipeline_id).subscribe(
      (res: any) => {
        if (res.success) {
          this.triggerSnackBar(res.message, 'Close');
          if(res.data.data.length > 0){
            this.Leads = res.data.data;
            this.canShow = true;
            console.log("listLeadGridView");
            console.log(res);
            console.log(this.Leads);
            this.totalLead = res.data.summary.total_leads;
            this.totalValue = res.data.summary.total_value;
            this.avgValue = res.data.summary.lead_average;
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
