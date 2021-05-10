import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from '../../../services/extract-error-messages-from-error-response';
import { FormStatus } from '../../../services/form-status';

import { SettingsApiService } from 'src/app/services/settings-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, Observable, of as observableOf, BehaviorSubject, combineLatest, merge } from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatInputModule} from '@angular/material/input';
//import { AnyARecord } from 'dns';
interface ADDPERSONROLE {
  value: string;
  viewValue: string;
}
/*For Role Table*/
export interface ROLE {
  role: string;
  accessLevel: string;
}
/*For Role Table*/
/*For User Table*/
export interface USER {
  profile: string;
  user: string;
  role: string;
  accessLevel: string;
}
/*For User Table*/
@Component({
  selector: 'app-usersroles',
  templateUrl: './usersroles.component.html',
  styleUrls: ['./usersroles.component.css'],
})
export class UsersrolesComponent implements OnInit, AfterViewInit {
  /*For Role Table*/
  //displayedRoleColumns: string[] = ['role', 'accessLevel', 'status', 'action'];
  /*For Role Table*/
  /*For User Table*/
  /*displayedUserColumns: string[] = [
    'user',
    'role',
    'accessLevel',
    'status',
    'action',
  ];*/
  /*For User Table*/
  //dataSourceRole: MatTableDataSource<ROLE>; /*For Role Table*/
  //dataSourceUser: MatTableDataSource<USER>; /*For User Table*/
  /*For Role Table*/
  /*@ViewChild('ROLESPAGINATOR', { static: true }) rolesPaginator: MatPaginator;
  @ViewChild('ROLESSORT', { static: true }) rolesSort: MatSort;
  @ViewChild('USERSPAGINATOR', { static: true }) usersPaginator: MatPaginator;
  @ViewChild('USERSSORT', { static: true }) usersSort: MatSort;*/
  ngAfterViewInit() {
    /*this.dataSourceRole.paginator = this.rolesPaginator;
    this.dataSourceRole.sort = this.rolesSort;
    this.dataSourceUser.paginator = this.usersPaginator;
    this.dataSourceUser.sort = this.usersSort;*/
    this.listUsers();

  }
  /*rolesFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRole.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceRole.paginator) {
      this.dataSourceRole.paginator.firstPage();
    }
  }*/
  /*usersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUser.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceUser.paginator) {
      this.dataSourceUser.paginator.firstPage();
    }
  }*/
  /*For Role Table*/
  //roles: ROLE[]; /*For Role Table*/
  //users: USER[]; /*For user Table*/
  /*Modal dialog*/
  closeResult = '';
  /*Modal dialog*/
  /*Browse File*/
  addPersonImage: File = null;
  addPersonImageUrl: string | ArrayBuffer =
    '../../../assets/images/settingsProfile.png';
  /*Browse File*/
  addPersonRoles: ADDPERSONROLE[] = [
    {
      value: '1',
      viewValue: 'Operations manager',
    },
    {
      value: '2',
      viewValue: 'Office manager',
    },
    {
      value: '3',
      viewValue: 'Admin',
    },
  ];
  /*Add Person Mandatory checkbox*/
  isAddPersonMand: boolean;
  /*Add Person Mandatory checkbox*/
  addPersonForm: FormGroup;

  addPersonRoleControl = new FormControl(this.addPersonRoles[2].value);

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService,
    private cdref: ChangeDetectorRef
  ) {

    //this.initaddPersonForm();
  }
  /*Browse file*/
  addPersonImageEvent(event) {
    this.addPersonImage = event.target.files[0];
  }

  removeAddPersonImage() {
    this.addPersonImage = null;
    this.addPersonImageUrl = '../../../assets/images/settingsProfile.png';
  }

  onChangeAddPerson(profile: File) {
    if (profile) {
      this.addPersonImage = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = (event) => {
        this.addPersonImageUrl = reader.result;
      };
    }
  }
  /*Browse file*/

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /*Modal dialog*/

  /*Create New Role Modal Settings All Modules checkbox
  selectAllSettings() {
    this.settingsPermission.map((r) => {
      r.isSelected = this.isSelectAllSettings;
    });
  }

  unSelectAllSettings(isSelected) {
    if (!isSelected) {
      this.isSelectAllSettings = false;
    } else if (
      this.settingsPermission.length ===
      this.settingsPermission.filter((r) => {
        return r.isSelected === true;
      }).length
    ) {
      this.isSelectAllSettings = true;
    }
  }*/
  /*Create New Role Modal Settings All Modules checkbox*/

  /*Create New Role Modal Settings View checkbox
  selectAllSettingsView() {
    this.settingsPermission.map((r) => {
      r.isSelectedView = this.isSelectAllSettingsView;
    });
  }

  unSelectAllSettingsView(isSelected) {
    if (!isSelected) {
      this.isSelectAllSettingsView = false;
    } else if (
      this.settingsPermission.length ===
      this.settingsPermission.filter((r) => {
        return r.isSelectedView === true;
      }).length
    ) {
      this.isSelectAllSettingsView = true;
    }
  }*/
  /*Create New Role Modal Settings View checkbox*/

  /*Create New Role Modal Settings Create checkbox
  selectAllSettingsCreate() {
    this.settingsPermission.map((r) => {
      r.isSelectedCreate = this.isSelectAllSettingsCreate;
    });
  }

  unSelectAllSettingsCreate(isSelected) {
    if (!isSelected) {
      this.isSelectAllSettingsCreate = false;
    } else if (
      this.settingsPermission.length ===
      this.settingsPermission.filter((r) => {
        return r.isSelectedCreate === true;
      }).length
    ) {
      this.isSelectAllSettingsCreate = true;
    }
  }*/
  /*Create New Role Modal Settings Create checkbox*/

  /*Create New Role Modal Settings Create checkbox
  selectAllSettingsEdit() {
    this.settingsPermission.map((r) => {
      r.isSelectedEdit = this.isSelectAllSettingsEdit;
    });
  }

  unSelectAllSettingsEdit(isSelected) {
    if (!isSelected) {
      this.isSelectAllSettingsEdit = false;
    } else if (
      this.settingsPermission.length ===
      this.settingsPermission.filter((r) => {
        return r.isSelectedEdit === true;
      }).length
    ) {
      this.isSelectAllSettingsEdit = true;
    }
  }*/
  /*Create New Role Modal Settings Edit checkbox*/

  /** Users Code */

  ngOnInit(): void {
    /*For Role Table*/
    /*this.roles = [
      {
        role: 'Operations manager',
        accessLevel: 'Full access',
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access',
      },
      {
        role: 'Office manager',
        accessLevel: 'View only',
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access',
      },
      {
        role: 'Office manager',
        accessLevel: 'Edit only',
      },
      {
        role: 'Office manager',
        accessLevel: 'Full access',
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access',
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access',
      },
      {
        role: 'Office manager',
        accessLevel: 'Edit only',
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access',
      },
      {
        role: 'Office manager',
        accessLevel: 'Full access',
      },
    ];*/

    /*For User Table*/
    /*this.users = [
      {
        profile: 'http://localhost:4200/assets/images/welcomemail-image.jpg',
        user: 'Allen',
        role: 'Operations manager',
        accessLevel: 'Full access',
      },
      {
        profile: 'http://localhost:4200/assets/images/user-sample.png',
        user: 'Peterson',
        role: 'Operations manager',
        accessLevel: 'Full access',
      },
    ];*/
    //this.dataSourceRole = new MatTableDataSource(this.roles); /*For Role Table*/
    //this.dataSourceUser = new MatTableDataSource(this.users); /*For User Table*/
  }
  /**=============================================================================================================== */
  // 1 - Initialize a form status object for the component
  formStatus = new FormStatus();
  private subscriptions: Subscription[] = [];
  filterValue = "";

  userData = {
    role_id: 1
  };
  rolesList = [];

  /**============ User Section ============*/
  displayedColumns: string[] = ['first_name', 'name', 'access_level', 'record_status', 'Action'];

  data: Observable<any[]>;
  UsersList: Observable<any[]>;
  updateUserId = "";
  deleteUserId = "";
  userConfirmationForDelete = false;

  resultsLength = 0; resultsLengthRole = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  initaddPersonForm(data: any = []) {
    if (data) {
      this.updateUserId = data.id;
      this.addPersonForm = this.fb.group({
        first_name: [
          data.first_name,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(255),
            //Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
          ],
        ],
        last_name: [data.last_name, [Validators.required, Validators.maxLength(255)]],
        email: [
          data.email,
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        mobile_code: ['+91', Validators.required],
        mobile_number: [data.phone_number, [Validators.required, Validators.maxLength(32)]],
        work_number: [data.work_number, [Validators.required, Validators.maxLength(32)]],
        user_role_id: [data.role_id, []],
        address: [data.address, []],
        skype_id: [data.skype_id, []],
        description: [data.description, []],
      });
    } else {
      this.addPersonForm = this.fb.group({
        first_name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(255),
            //Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
          ],
        ],
        last_name: ['', [Validators.required, Validators.maxLength(255)]],
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        mobile_code: ['+91', Validators.required],
        mobile_number: ['', [Validators.required, Validators.maxLength(32)]],
        work_number: ['', [Validators.required, Validators.maxLength(32)]],
        user_role_id: [this.rolesList[0].id, []],
        address: ['', []],
        skype_id: ['', []],
        description: ['', []],
      });
    }
  }
  /*Modal dialog*/
  open(content, id="") {
    this.settingsApiService.initUserForm(id).subscribe(
      (res: any) => {
        console.log('initUserForm');
        console.log(res);
        if (res.success) {
          if (res.data.menu_previlages.create == 1) {
            this.userData = res.data.user;
            this.rolesList = res.data.roles;
            this.initaddPersonForm(this.userData);
            this.modalService
              .open(content, { ariaLabelledBy: 'dialog001' })
              .result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                },
                (reason) => {
                  this.closeResult = `Dismissed ${this.getDismissReason(
                    reason
                  )}`;
                }
              );
          } else {
            this.triggerSnackBar(res.message, 'Close');
          }
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        //console.log(errorResponse);
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        console.log(messages);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
    /*this.modalService
      .open(content, { ariaLabelledBy: 'dialog001' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );*/
  }
  onSubmit() {
    if (!this.addPersonForm.valid) {
      //console.log(this.registrationForm.controls.first_name.errors);
      return false;
    } else {
      // 2 - Call onFormSubmitting to handle setting the form as submitted and
      //     clearing the error and success messages array
      this.formStatus.onFormSubmitting();
      console.log("submit");
      console.log(this.addPersonForm.value);
      console.log(this.addPersonImage);
      var formData: any = new FormData();
      if(this.addPersonImage){
        formData.append("profile_pic", this.addPersonImage, this.addPersonImage.name);
      }

      formData.append("address", this.addPersonForm.get('address').value);
      formData.append("description", this.addPersonForm.get('description').value);
      formData.append("email", this.addPersonForm.get('email').value);
      formData.append("first_name", this.addPersonForm.get('first_name').value);
      formData.append("last_name", this.addPersonForm.get('last_name').value);
      formData.append("mobile_code", this.addPersonForm.get('mobile_code').value);
      formData.append("mobile_number", this.addPersonForm.get('mobile_number').value);
      formData.append("skype_id", this.addPersonForm.get('skype_id').value);
      formData.append("user_role_id", this.addPersonForm.get('user_role_id').value);
      formData.append("work_number", this.addPersonForm.get('work_number').value);

      if(this.updateUserId){
        const subs_query_param = this.settingsApiService
        .updateUser(formData, this.updateUserId)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
            this.modalService.dismissAll();
            this.listUsers();
          },
          (errorResponse: HttpErrorResponse) => {
            //console.log(errorResponse);
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            console.log(messages);
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_param);
      } else {
        const subs_query_param = this.settingsApiService
        .addUser(formData)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
            this.modalService.dismissAll();
            this.listUsers();
          },
          (errorResponse: HttpErrorResponse) => {
            //console.log(errorResponse);
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            console.log(messages);
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_param);
      }

    }
  }

  listUsers(){
    console.log("list user");
    this.UsersList = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        // startWith([undefined, ]),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log("sort");
          console.log(this.sort.sortChange);
          console.log(this.sort.active);
          console.log(this.sort.direction);
          //console.log(this.paginator.pageIndex);
          return this.settingsApiService.listUser(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.data.recordsTotal;

          return data.data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      );
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  closeModal(){
    this.updateUserId = "";
    this.deleteUserId = "";
    this.modalService.dismissAll();
  }

  filterUsers(){
    console.log("keyup");
    this.resetPaging();
    this.listUsers();
  }

  changeUserStatus(enable: boolean, id){
    var status = 2
    if(enable){
      status = 1;
    }
    const subs_query_changeuser = this.settingsApiService
        .changeUserStatus(status, id)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
          },
          (errorResponse: HttpErrorResponse) => {
            //console.log(errorResponse);
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            console.log(messages);
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_changeuser);
  }

  deleteModal(content, id){
    this.deleteUserId = id;
    this.modalService
    .open(content, { ariaLabelledBy: 'dialog001' })
    .result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(
          reason
        )}`;
      }
    );
  }
  deleteUser(id){
    this.settingsApiService.deleteUser(id).subscribe(
      (res: any) => {
        console.log('initUserForm');
        console.log(res);
        if (res.success) {
          this.triggerSnackBar(res.message, 'Close');
          this.modalService.dismissAll();
          this.listUsers();
          this.deleteUserId = "";
          this.userConfirmationForDelete = false;
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        //console.log(errorResponse);
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        console.log(messages);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }

  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    console.log(this.subscriptions);
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }
  compareFunction(o1: any, o2: any) {
    console.log("compare");
    console.log(o1);
    console.log(o2);
    return (o1 == o2);
   }
}
