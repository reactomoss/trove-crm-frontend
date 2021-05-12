import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  // selectedDisplay = "all"

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
