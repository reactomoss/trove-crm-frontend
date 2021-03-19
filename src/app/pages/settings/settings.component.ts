import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {SnackBarService} from '../../shared/snack-bar.service';
// For Account Select Box
interface TIMEZONE{
  value: string;
  viewValue: string;
}
interface TIMEFORMAT{
  value: string;
  viewValue: string;
}
interface DATEFORMAT{
  value: string;
  viewValue: string;
}
interface CURRENCYFORMAT{
  value: string;
  viewValue: string;
}
interface ADDPERSONROLE{
  value: string;
  viewValue:string;
}
// For Account Select Box
/*For Role Table*/
export interface ROLE {
  role: string;
  accessLevel: string;
}
/*For Role Table*/
/*For User Table*/
export interface USER {
  profile:string;
  user:string;
  role: string;
  accessLevel: string;
}
/*For User Table*/
/*For PipelineStages Table*/
export interface PIPELINESTAGE {
  pipelineStages: string;
  dealStages: any;
}
/*For PipelineStages Table*/
/*For import history Table*/
export interface IMPORTHISTORY{
  importName: string;
  importType: string;
  importDate: any;
}
/*For import history Table*/

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit , AfterViewInit {
  /*For Account -- time zone select box*/
  accountForm: FormGroup;
  timeZones: TIMEZONE[] = [
    {
      value: 'Denver(GMT-6)',
      viewValue: 'Denver (GMT-6)'
    },
    {
      value: 'Newyork(GMT-6)',
      viewValue: 'Newyork (GMT-6)'
    },
    {
      value: 'Kolkata(GMT-6)',
      viewValue: 'Kolkata (GMT-6)'
    },
    {
      value: 'Chennai(GMTTT-6)',
      viewValue: 'Chennai (GMT-6)'
    }
  ]

  timeFormats: TIMEFORMAT[] = [
    {
      value: '24Hours',
      viewValue: '24 Hours'
    },
    {
      value: '12Hours',
      viewValue: '12 Hours'
    }
  ]

  dateFormats: DATEFORMAT[] = [
    {
      value: 'mm/dd/yy',
      viewValue: 'mm/dd/yy'
    },
    {
      value: 'dd/mm/yy',
      viewValue: 'dd/mm/yy'
    },
    {
      value: 'yy/mm/dd',
      viewValue: 'yy/mm/dd'
    }
  ]

  currencyFormats: CURRENCYFORMAT[] = [
    {
      value: 'UnitedStatesDollar',
      viewValue: 'United States Dollar'
    },
    {
      value: 'SingaporeDollar',
      viewValue: 'Singapore Dollar'
    },
    {
      value: 'DubaiDirhams',
      viewValue: 'Dubai Dirhams'
    },
    {
      value: 'IndianRupees',
      viewValue: 'Indian Rupees'
    }
  ]

  addPersonRoles: ADDPERSONROLE[] = [
    {
      value: 'Operationsmanager',
      viewValue: 'Operations manager'
    },
    {
      value: 'Officemanager',
      viewValue: 'Office manager'
    },
    {
      value: 'Admin',
      viewValue: 'Admin'
    }
  ]

  timeZoneControl = new FormControl(this.timeZones[3].value);
  timeFormatControl = new FormControl(this.timeFormats[0].value)
  dateFormatControl = new FormControl(this.dateFormats[2].value)
  currencyFormatControl = new FormControl(this.currencyFormats[3].value)
  addPersonRoleControl = new FormControl(this.addPersonRoles[2].value)
  /*For Account -- time zone select box*/
/*For Role Table*/
  displayedRoleColumns: string[] = ['role', 'accessLevel', 'status', 'action'];
/*For Role Table*/
/*For User Table*/
displayedUserColumns: string[] = ['user', 'role', 'accessLevel', 'status' , 'action'];
/*For User Table*/
/*For PipelineStages Table*/
displayedPipelineColumns: any[] = ['pipelineStages', 'dealStages', 'action'];
/*For PipelineStages Table*/
/*For Import History Table*/
displayedImportColumns: any[] = ['importName' , 'importType' , 'importDate'];
/*For Import History Table*/

dataSourceRole: MatTableDataSource<ROLE>;  /*For Role Table*/
dataSourceUser: MatTableDataSource<USER>;  /*For User Table*/
dataSourcePipeline: MatTableDataSource<PIPELINESTAGE>; /*For Pipeline Table*/
dataSourceImport: MatTableDataSource<IMPORTHISTORY>; /*For Import History Table*/
/*For Role Table*/
@ViewChild('ROLESPAGINATOR', {static: true}) rolesPaginator: MatPaginator;
@ViewChild('ROLESSORT', {static: true}) rolesSort: MatSort;
@ViewChild('USERSPAGINATOR', {static: true}) usersPaginator: MatPaginator;
@ViewChild('USERSSORT', {static: true}) usersSort: MatSort;
ngAfterViewInit() {
  this.dataSourceRole.paginator = this.rolesPaginator;
  this.dataSourceRole.sort = this.rolesSort;
  this.dataSourceUser.paginator = this.usersPaginator;
  this.dataSourceUser.sort = this.usersSort;
}
rolesFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceRole.filter = filterValue.trim().toLowerCase();
  if (this.dataSourceRole.paginator) {
    this.dataSourceRole.paginator.firstPage();
  }
}
usersFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceUser.filter = filterValue.trim().toLowerCase();
  if (this.dataSourceUser.paginator) {
    this.dataSourceUser.paginator.firstPage();
  }
}
/*For Role Table*/
roles: ROLE[]; /*For Role Table*/
users: USER[]; /*For user Table*/
pipelines: PIPELINESTAGE[]; /*For Pipeline Table*/
importHistory: IMPORTHISTORY[]; /*For Imports History Table*/
/*Create New Role Modal Settings All Modules checkbox*/
  isSelectAllSettings:boolean;
  settingsPermission:any = [
    {
      name: "Administration",
      isSelected: false
    },
    {
      name: "Lead access ",
      isSelected: false
    },
    {
      name: "Contact access",
      isSelected: false
    }
  ];
/*Create New Role Modal Settings All Modules checkbox*/
/*Create New Role Modal Settings View checkbox*/
isSelectAllSettingsView:boolean;
/*Create New Role Modal Settings View checkbox*/
/*Create New Role Modal Settings Create checkbox*/
isSelectAllSettingsCreate:boolean;

/*Create New Role Modal Settings Create checkbox*/
/*Create New Role Modal Settings Edit checkbox*/
isSelectAllSettingsEdit:boolean;

/*Create New Role Modal Settings Edit checkbox*/

/*Notification user checkbox*/
isNotiUserAll:boolean;
notificationUser:any=[
  {
    name:"When deal is assigned",
    isSelected: false
  },
  {
    name:"When task is assigned",
    isSelected: false
  },
  {
    name:"When contact is assigned",
    isSelected: false
  }
];
/*Notification user checkbox*/
/*Notification System checkbox*/
isNotiSystemAll:boolean;
notificationSystem:any=[
  {
    name:"When import is completed",
    isSelected: false
  },
  {
    name:"When export is completed",
    isSelected: false
  }
];
/*Notification user checkbox*/
/*Add Person Mandatory checkbox*/
isAddPersonMand:boolean;
/*Add Person Mandatory checkbox*/
/*Browse File*/
  profile: File = null;
  imageUrl: string | ArrayBuffer = "../../../assets/images/settingsProfile.png";
  addPersonImage: File = null;
  addPersonImageUrl: string | ArrayBuffer = "../../../assets/images/settingsProfile.png";
/*Browse File*/

/*Form Validation*/
  changePasswordForm: FormGroup;
  changePassword() {
   this.changePasswordForm = this.fb.group({
      oldpassword: ['', Validators.required ],
      newpassword:['', Validators.required],
      confirmpassword:['', Validators.required]
   });
 }
 newRoleForm: FormGroup;
 newRole() {
   this.newRoleForm = this.fb.group({
      role: ['', Validators.required ]
   });
 }

 addPersonForm: FormGroup;
 addPerson() {
   this.addPersonForm = this.fb.group({
      firstName: ['', Validators.required ],
      lastName: ['', Validators.required ],
      mobileNumber:['', Validators.required],
      workNumber: ['', Validators.required ],
      emailAddress:['', Validators.required],
      addPersonRole: this.addPersonRoleControl
   });
 }

 addPipelineForm: FormGroup;
 addPipeline(){
   this.addPipelineForm = this.fb.group({
      pipeline: ['', Validators.required]
   });
 }
/*Form Validation*/

/*For Password Visible */
 oldPwd = true;
 newPwd = true;
 confirmPwd = true;
/*For Password Visible */
/*Modal dialog*/
closeResult = '';
/*Modal dialog*/
  constructor(private modalService: NgbModal , private fb: FormBuilder,
    private sb: SnackBarService) {
/*Form Validation*/
    this.changePassword();
    this.newRole();
    this.addPerson();
    this.addPipeline();
/*Form Validation*/
this.accountForm = new FormGroup({
  timeZone: this.timeZoneControl,
  timeFormat: this.timeFormatControl,
  dateFormat: this.dateFormatControl,
  currencyFormat: this.currencyFormatControl
});
  }

  //defining method for display of SnackBar
  triggerSnackBar(message:string, action:string)
  {
   this.sb.openSnackBarBottomCenter(message, action);
  }

/*Modal dialog*/
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openNewRole(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
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

 /*Browse file*/

  profilePicture(event){
    this.profile=event.target.files[0];
  }
  removeProfilePicture(){
    this.profile = null;
    this.imageUrl="../../../assets/images/settingsProfile.png";
  }
  onChangeProfile(profile: File) {
    if (profile) {
      this.profile = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = event => {
        this.imageUrl = reader.result;
      };
    }
  }

  addPersonImageEvent(event){
    this.addPersonImage = event.target.files[0];
  }

  removeAddPersonImage(){
    this.addPersonImage = null;
    this.addPersonImageUrl= "../../../assets/images/settingsProfile.png";
  }

  onChangeAddPerson(profile: File) {
    if (profile) {
      this.profile = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = event => {
        this.addPersonImageUrl = reader.result;
      };
    }
  }

 /*Browse file*/

/*Create New Role Modal Settings All Modules checkbox*/
  selectAllSettings(){
    this.settingsPermission.map(r => {
      r.isSelected= this.isSelectAllSettings;
    });
  }

  unSelectAllSettings(isSelected){
   if(!isSelected){
     this.isSelectAllSettings=false;
   }else if(this.settingsPermission.length ===
    this.settingsPermission.filter(r => {return r.isSelected === true}).length){
      this.isSelectAllSettings=true;
   }
  }
/*Create New Role Modal Settings All Modules checkbox*/

/*Create New Role Modal Settings View checkbox*/
selectAllSettingsView(){
  this.settingsPermission.map(r => {
    r.isSelected= this.isSelectAllSettingsView;
  });
}

unSelectAllSettingsView(isSelected){
 if(!isSelected){
   this.isSelectAllSettingsView=false;
 }else if(this.settingsPermission.length ===
  this.settingsPermission.filter(r => {return r.isSelected === true}).length){
    this.isSelectAllSettingsView=true;
 }
}
/*Create New Role Modal Settings View checkbox*/




/*Notification user checkbox*/
selectAllNotiUser(){
  this.notificationUser.map(r => {
    r.isSelected = this.isNotiUserAll;
  });
}
unSelectNotiUser(isSelected){
  if(!isSelected){
    this.isNotiUserAll=false;
  }else if(this.notificationUser.length ===
    this.notificationUser.filter(r => {return r.isSelected === true}).length){
      this.isNotiUserAll=true;
    }
}
/*Notification user checkbox*/

/*Notification System checkbox*/
selectAllNotiSystem(){
  this.notificationSystem.map(r => {
    r.isSelected = this.isNotiSystemAll;
  });
}
unSelectNotiSystem(isSelected){
  if(!isSelected){
    this.isNotiSystemAll=false;
  }else if(this.notificationSystem.length ===
    this.notificationSystem.filter(r => {return r.isSelected === true}).length){
      this.isNotiSystemAll=true;
    }
}
/*Notification System checkbox*/

// Pipeline drag and drop
dragElements:any = [
  {
    name: 'Discovery',
    value: '95%'
  },
  {
    name: 'Qualified',
    value: '65%'

  },
  {
    name: 'Evaluation',
    value: '75%'

  },
  {
    name: 'Closed',
    value: '45%'

  },
  {
    name: 'Negotiation',
    value: '25%'

  }

];

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.dragElements, event.previousIndex, event.currentIndex);
}

// add pipeline method

addPipelineStage(){
   this.dragElements.push({
     name: 'Sample',
     value:'0%'
   })
}
// remove pipeline method
removePipelineStage(index:number){
    this.dragElements.splice(index,1);
}

// Pipeline drag and drop

//Drag and drop file upload

files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
//Drag and drop file upload

  ngOnInit(): void {
      /*For Role Table*/
    this.roles = [
      {
        role: 'Operations manager',
        accessLevel: 'Full access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'View only'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Edit only'
      },
      {
        role: 'Office manager',
        accessLevel: 'Full access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Edit only'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Full access'
      }
    ];

      /*For User Table*/
    this.users = [
      {
        profile:'http://localhost:4200/assets/images/welcomemail-image.jpg',
        user: 'Allen',
        role: 'Operations manager',
        accessLevel: 'Full access'
      },
      {
        profile:'http://localhost:4200/assets/images/user-sample.png',
        user: 'Peterson',
        role: 'Operations manager',
        accessLevel: 'Full access'
      }
    ];
    // For Pipeline table
    this.pipelines = [
      {
        pipelineStages: 'Mobile/Web App Development',
        dealStages: 4
      },
      {
        pipelineStages: 'Sales Pipeline',
        dealStages: 5,
      },
      {
        pipelineStages: 'Demo',
        dealStages: 6
      }
    ];

    // For Imports History Table
    this.importHistory = [
      {
        importName: 'Edward James',
        importType: 'google contacts',
        importDate: '23/04/2020'
      },
      {
        importName: 'James Anderson',
        importType: 'CSV upload',
        importDate: '24/04/2020'
      }
    ];

    this.dataSourceRole = new MatTableDataSource(this.roles); /*For Role Table*/
    this.dataSourceUser = new MatTableDataSource(this.users); /*For User Table*/
    this.dataSourcePipeline = new MatTableDataSource(this.pipelines) /*For Pipeline Table*/
    this.dataSourceImport = new MatTableDataSource(this.importHistory)/*For Import History Table*/
  }
}
