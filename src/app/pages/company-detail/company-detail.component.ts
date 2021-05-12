import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { CompanyDialog } from 'src/app/shared/header/header.component';
import { TaskDialog } from '../detail/task-dialog/task-dialog';
import { AppointDialog } from '../detail/appoint-dialog/appoint-dialog';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  status = "active"
  // selectedDisplay = "all"

  constructor(private router: Router , public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  goToList() {
    this.router.navigate(['/pages/company']);
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

   editCompany() {
    const dialogRef = this.dialog.open(CompanyDialog, {
      width: '560px',
      autoFocus: false,
      data : { isEdit : true}
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }

}
