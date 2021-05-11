import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppointDialog } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog } from '../detail/task-dialog/task-dialog';
import { ContactDialog } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  status = "active"
  selectedDisplay = "all"

  constructor(private router: Router , public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  goToList() {
    this.router.navigate(['/pages/contact']);
  }

  openTaskDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

   openAppointDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
   }

   editContact() {
    const dialogRef = this.dialog.open(ContactDialog, {
      width: '531px',
      autoFocus: false,
      data : { isEdit : true}
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }

}

// @Component({
//   selector: 'task-dialog',
//   templateUrl: '../detail/task-dialog/task-dialog.html',
//   styleUrls: ['../detail/task-dialog/task-dialog.css'],
//   providers: [
//     // The locale would typically be provided on the root module of your application. We do it at
//     // the component level here, due to limitations of our example generation script.
//     {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

//     // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
//     // `MatMomentDateModule` in your applications root module. We provide it at the component level
//     // here, due to limitations of our example generation script.
//     {
//       provide: DateAdapter,
//       useClass: MomentDateAdapter,
//       deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//     },
//     {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
//   ],
// })
// export class TaskDialog {
//   scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

//   myControl = new FormControl()
//   options: string[] = ['One', 'Two', 'Three']
//   filteredOptions: Observable<string[]>;

//   selected: string[] = []
//   showAuto: boolean = true

//   active: number = 1

//   constructor(
//     public dialogRef: MatDialogRef<AppointDialog>
//     // @Inject(MAT_DIALOG_DATA) public data: DialogData
//   ) {
//     this.filteredOptions = this.myControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filter(value))
//     );
//   }

//   private _filter(value: string): string[] {
//     const filterValue = value.toLowerCase();

//     return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
//   }

//   public onSelectionChange(event) {
//     this.selected.push(event.option.value)
//     this.showAuto = false
//   }

//   public clickAdd() {
//     console.log('click add')
//     this.showAuto = !this.showAuto
//   }

//   public activeClass(num) {
//     if (num == this.active)
//       return 'activeBtn'
//     else
//       return ''
//   }

//   public setActive(num) {
//     console.log('set active', num)
//     this.active = num
//     if (num == 1) {
//       this.options = ['One', 'Two', 'Three']
//     } else if (num == 2) {
//       this.options = ['Four', 'Five', 'Six']
//     } else if (num == 3) {
//       this.options = ['Seven', 'Eight', 'Nine']
//     }
//     this.filteredOptions = this.myControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filter(value))
//     )
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   deleteSelected(e) {
//     const index = this.selected.indexOf(e)
//     this.selected.splice(index, 1)
//     this.selected.length == 0 && (this.showAuto = true)
//   }
// }

// @Component({
//   selector: 'appoint-dialog',
//   templateUrl: '../detail/appoint-dialog/appoint-dialog.html',
//   styleUrls: ['../detail/appoint-dialog/appoint-dialog.css'],
//   providers: [
//     // The locale would typically be provided on the root module of your application. We do it at
//     // the component level here, due to limitations of our example generation script.
//     {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

//     // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
//     // `MatMomentDateModule` in your applications root module. We provide it at the component level
//     // here, due to limitations of our example generation script.
//     {
//       provide: DateAdapter,
//       useClass: MomentDateAdapter,
//       deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//     },
//     {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
//   ],
// })
// export class AppointDialog {

//   myControl = new FormControl();
//   options: string[] = ['One', 'Two', 'Three'];
//   filteredOptions: Observable<string[]>;

//   selected: string[] = []
//   showAuto: boolean = true

//   active: number = 1

//   constructor(
//     public dialogRef: MatDialogRef<AppointDialog>
//     // @Inject(MAT_DIALOG_DATA) public data: DialogData
//   ) {
//     this.filteredOptions = this.myControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filter(value))
//     );
//   }

//   private _filter(value: string): string[] {
//     const filterValue = value.toLowerCase();

//     return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
//   }

//   public onSelectionChange(event) {
//     this.selected.push(event.option.value)
//     this.showAuto = false
//   }

//   public clickAdd() {
//     console.log('click add')
//     this.showAuto = !this.showAuto
//   }

//   public activeClass(num) {
//     if (num == this.active)
//       return 'activeBtn'
//     else
//       return ''
//   }

//   public setActive(num) {
//     console.log('set active', num)
//     this.active = num
//     if (num == 1) {
//       this.options = ['One', 'Two', 'Three']
//     } else if (num == 2) {
//       this.options = ['Four', 'Five', 'Six']
//     } else if (num == 3) {
//       this.options = ['Seven', 'Eight', 'Nine']
//     }
//     this.filteredOptions = this.myControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filter(value))
//     )
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   deleteSelected(e) {
//     const index = this.selected.indexOf(e)
//     this.selected.splice(index, 1)
//     this.selected.length == 0 && (this.showAuto = true)
//   }
// }
