import { TokenService } from './../../services/token.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  FormGroupDirective
 } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import { SnackBarService } from '../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from '../../services/extract-error-messages-from-error-response';
import { FormStatus } from '../../services/form-status';
import { LeadApiService } from '../../services/lead-api.service';
import { HttpErrorResponse } from '@angular/common/http';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isNotification: boolean = false;
  menus: any[];
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  active: number = 1;
  selectedStage: number = 3;
  constructor(
    private router: Router,
    private account: AccountApiService,
    private token: TokenService,
    public dialog: MatDialog,
    private sb: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.menus = [
      {
        icon:'menu001.png',
        link:'/pages/dashboard'
      },
      {
        icon:'menu006.png',
        link:'/pages/leads'
      },
      {
        icon:'menu002.png',
        link:'/pages/contact'
      },
      {
        icon:'menu003.png',
        link:'/pages/company'
      },
      {
        icon:'menu004.png',
        link:'/pages/task'
      },
      {
        icon:'menu005.png',
        link:'/pages/appointments'
      }
    ];
  }
  showNotification() {
    this.isNotification = !this.isNotification;
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

  onSelectionChange(event) {}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  logout() {
    this.account.logout().subscribe(
      (response) => {
        console.log(response);
        this.token.remove();
        //this.router.navigate(['login']);
        let objToSend: NavigationExtras = {
          queryParams: {
            success: response.success,
            message: response.message,
          },
        };
        this.router.navigate(['login'], {
          state: objToSend,
        });
        //this.router.navigate(['login'], {queryParams: { logout: 'true' } });
      },
      (err) => {
        console.log(err);
        if (err.error.code == 113) {
          this.token.remove();
          let objToSend: NavigationExtras = {
            queryParams: {
              success: true,
              message: 'Logged out successfully!',
            },
          };
          this.router.navigate(['login'], {
            state: objToSend,
          });
          //this.router.navigate(['login'], {queryParams: { logout: 'true' } });
        }
      }
    );
  }
  clickLead() {
    const dialogRef = this.dialog.open(LeadDialog, {
      width: '560px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  clickContact() {
    const dialogRef = this.dialog.open(ContactDialog, {
      width: '531px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  clickCompany() {
    const dialogRef = this.dialog.open(CompanyDialog, {
      width: '560px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'lead-dialog',
  templateUrl: 'lead-dialog/lead-dialog.html',
  styleUrls: ['lead-dialog/lead-dialog.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, //MAT_MOMENT_DATE_FORMATS
  ],
})
export class LeadDialog {
  searchControl = new FormControl();
  options: string[] = [
    'Lead Name',
    'Primary Contact',
    'Value',
    'Company',
    'Owner',
    'Source',
    'Secondary Contact',
    'Added On',
    'Estimate Close Date',
    'Pipeline Category',
    'Stage',
    'Description',
  ];
  filteredOptions: Observable<string[]>;

  showMandatory: boolean = false;
  search: string = '';

  stages: any[] = [];
  selectedStage = 0;
  selectedStageId = "";
  currencyCode = "";
  isEdit: boolean = false;

  @Input() addLeadForm: FormGroup;
  formStatus = new FormStatus();

  pipelines: any[] = [];
  currency: any[] = [];
  organizations: any[] = [];
  sources: any[] = [];
  contacts: any[] = [];
  owners: any[] = [];
  formLoaded = false;
  selectedContacts: any[];
  userProfile = JSON.parse(localStorage.getItem('me'));
  private subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<LeadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sb: SnackBarService,
    private LeadApiService: LeadApiService,
    private fb: FormBuilder,
  ) {
    this.isEdit = this.data?.isEdit;
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    //this.sb.openSnackBarBottomCenter("Test", '');
  }
  ngOnInit() {
    this.LeadApiService.initLeadForm().subscribe(
      (res: any) => {
        console.log("Lead Init form");
        console.log(res);
        if (res.success) {
          this.formLoaded = true;
          this.pipelines = res.data.pipelines;
          this.currency = res.data.currency;
          this.organizations = res.data.organizations;
          this.sources = res.data.sources;
          this.contacts = res.data.contacts;
          this.owners = res.data.owner;
          //this.currencypostvalue.id = res.data.currency.id;
          if(res.data.lead){
            this.initaddLeadForm(res.data.lead);
          } else {
            this.initaddLeadForm();
            this.stages = res.data.pipelines[0].stages;
            this.addLeadForm.get('pipeline_id').patchValue(res.data.pipelines[0].id);
            this.addLeadForm.get('stage_id').patchValue(res.data.pipelines[0].stages[0].id);
            this.selectedStageId = res.data.pipelines[0].stages[0].id;
          }
          this.addLeadForm.get('currency.id').patchValue(res.data.currency.id);
          this.currencyCode = res.data.currency.code;
          this.sb.openSnackBarBottomCenter(res.message, 'Close');
        } else {
          this.sb.openSnackBarBottomCenter(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.sb.openSnackBarBottomCenter(messages.toString(), 'Close');
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked;
  }

  checkShow(name) {
    if (!this.search) return true;
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false;
    else return true;
  }

  getLeftOffset(index) {
    return -8 * index;
  }

  getStageSrc(index) {
    if (index == 0) {
      if (this.selectedStage == 0) {
        return '../../../../assets/images/stage/start-active-stage-md.svg';
      } else {
        return '../../../../assets/images/stage/start-stage-md.svg';
      }
    }
    if (index == this.selectedStage) {
      return '../../../../assets/images/stage/active-stage-md.svg';
    }
    return '../../../../assets/images/stage/mid-stage-md.svg';
  }

  initaddLeadForm(data: any = []) {
    //alert("Form Init");
    if (data.length > 0) {
      this.addLeadForm = this.fb.group({
        name: [
          data.name,
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        organization_id: [data.organization_id, [Validators.required]],
        owner_id: [
          data.owner_id,
          [Validators.required],
        ],
        pipeline_id: [data.pipeline_id, [Validators.required]],
        stage_id: [data.stage_id, [Validators.required]],
        currency: this.fb.group({
            id: ['', [Validators.required]],
            value: ['', [Validators.required]]
        }),
        source_id: [data.source_id, []],
        added_on: [data.added_on, [Validators.required]],
        closed_on: [data.closed_on, [Validators.required]],
        description: [data.description, []],
        contacts: [null, [Validators.required]],
      });
      let assignedContacts = [];
      console.log("if");
      console.log(data);
      data.contacts.forEach((contact) => {
        assignedContacts.push(contact.id);
      });
      this.addLeadForm.controls.contacts.setValue(assignedContacts);
    } else {
      this.addLeadForm = this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        organization_id: ['', [Validators.required]],
        owner_id: [
          this.userProfile.id,
          [Validators.required],
        ],
        pipeline_id: ['', [Validators.required]],
        stage_id: ['', [Validators.required]],
        currency: this.fb.group({
          id: ['', [Validators.required]],
          value: ['', [Validators.required]]
        }),
        source_id: ['', []],
        added_on: ['', [Validators.required]],
        closed_on: ['', [Validators.required]],
        description: ['', Validators.maxLength(100),],
        contacts: [null, [Validators.required]]
      });
    }
  }
  saveLead(){
    if (!this.addLeadForm.valid) {
      return false;
    } else {
      // 2 - Call onFormSubmitting to handle setting the form as submitted and
      //     clearing the error and success messages array
      this.formStatus.onFormSubmitting();
      //console.log(this.selectedContacts.value);
      this.addLeadForm.patchValue({
        //contacts: this.selectedContacts.value,
        stage_id: this.selectedStageId,
        // formControlName2: myValue2
      });
      console.log("submitting");
      //console.log(this.selectedContacts.value);
      //console.log(this.selectedStage);
      console.log(this.addLeadForm.value);
      const subs_form = this.LeadApiService
        .addLead(this.addLeadForm.value)
        .subscribe(
          (response) => {
            this.dialogRef.close();
            this.sb.openSnackBarBottomCenter(response.message, 'Close');
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error.code === 252) {
            const validationErrors = errorResponse.error.data; //{name: "", organization_id: "", owner_id: "", pipeline_id: "", stage_id: "", currency: "", source_id: "", added_on: "", closed_on: "", description: "", contacts: ""};
            Object.keys(validationErrors).forEach((prop) => {
              const formControl = this.addLeadForm.get(prop);
              if (formControl) {
                formControl.setErrors({
                  serverError: validationErrors[prop],
                });
              }
            });
            console.log("vaidation errors");
            console.log(validationErrors);
          } else {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            // call onFormSubmitResponse with the submission success status (false) and the array of messages
            this.formStatus.onFormSubmitResponse({
              success: false,
              messages: messages,
            });
            this.sb.openSnackBarBottomCenter(messages.toString(), 'Close');
          }
          }
        );
      this.subscriptions.push(subs_form);
    }
  }

  onPipelineChange(ob){
    this.selectedStage = 0;
    let selectedPipeline = ob.value;
    console.log(selectedPipeline);
    var result = this.pipelines.find(obj => {
      return obj.id === selectedPipeline
    });
    this.stages = result.stages;
    this.selectedStageId = result.stages[0].id;
  }

  onContactChange(selected){
    this.selectedContacts = selected;
    this.addLeadForm.controls.contacts.setValue(this.selectedContacts);
  }

  compareFunction(o1: any, o2: any) {
    return (o1 == o2);
  }

   ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    //this.sub_social_auth.unsubscribe();
  }
}

@Component({
  selector: 'contact-dialog',
  templateUrl: 'contact-dialog/contact-dialog.html',
  styleUrls: ['contact-dialog/contact-dialog.css'],
})
export class ContactDialog {
  searchControl = new FormControl();
  options: string[] = [
    'First Name',
    'Last Name',
    'Mobile Number',
    'Work Number',
    'Company Name',
    'Email Address',
    'Contact Type',
    'Contact Group',
    'Address',
    'Skype ID',
    'Description',
  ];
  filteredOptions: Observable<string[]>;

  showMandatory: boolean = false;
  search: string = '';
  mobileCode = 'USA';
  userHover: boolean = false;
  imageHover: boolean = false;
  imageSrc: string;
  isEdit: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ContactDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = this.data?.isEdit;
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked;
  }

  checkShow(name) {
    if (!this.search) return true;
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false;
    else return true;
  }

  getUserIcon() {
    if (!this.userHover) return 'account_circle';
    return 'add';
  }

  userIcon() {
    let element: HTMLElement = document.getElementById(
      'fileInput'
    ) as HTMLElement;
    element.click();
    this.imageHover = false;
  }

  readURL(event: HTMLInputEvent): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result as string);

      reader.readAsDataURL(file);
    }
    this.imageHover = false;
  }

  removeImage() {
    this.imageSrc = '';
  }

  showOverlay() {
    return this.imageHover;
  }
}

@Component({
  selector: 'company-dialog',
  templateUrl: 'company-dialog/company-dialog.html',
  styleUrls: ['company-dialog/company-dialog.css'],
})
export class CompanyDialog {
  searchControl = new FormControl();
  options: string[] = [
    'Company Name',
    'Mobile Number',
    'Work Number',
    'Address',
    'City',
    'Post Code',
    'State/Region',
    'Country',
    'Email Address',
    'Owner',
    'Skype ID',
    'Description',
  ];
  filteredOptions: Observable<string[]>;

  showMandatory: boolean = false;
  search: string = '';

  mobileCode = 'USA';

  addressSelect = false;
  isEdit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CompanyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = this.data?.isEdit;
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked;
  }

  checkShow(name) {
    if (!this.search) return true;
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false;
    else return true;
  }
}
