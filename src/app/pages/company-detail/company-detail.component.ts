import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { AppointDialog, TaskDialog } from '../detail/detail.component';
import { CompanyDialog } from 'src/app/shared/header/header.component';
import {SnackBarService} from 'src/app/shared/snack-bar.service'

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {
  company = null
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  status = "active"
  // selectedDisplay = "all"

  constructor(
    private router: Router, 
    public dialog: MatDialog
  ){ 
    this.company = this.router.getCurrentNavigation().extras.state
    console.log('detail-compnay:', this.company)

    this.company ={
        DT_RowIndex: 1,
        address: "1st street, 3rd Block",
        category: "May, 2021",
        city: "Los Angles",
        company: true,
        contacts_count: 1,
        country_code: "+91",
        country_id: {id: 3, name: "Albania"},
        created_at: "2021-05-26T08:19:39.000000Z",
        created_by: "satham hussain",
        description: "Finance Management services",
        email: "chrome@gmail.com",
        id: 56,
        mobile: "3331112222",
        name: "Chrome",
        owner: {
            benifical_user: 3,
            email: "satham@hexagonsupport.com",
            first_name: "satham",
            full_name: "satham hussain",
            id: 3,
            last_name: "hussain",
            role_id: 1,
            role_name: "Admin",    
        },
        owner_id: 3,
        postal_code: "231755",
        skype_id: "sathamhexogon@outlook.com",
        state: "New-yark",
        status: "Active",
        updated_at: "2021-06-08T07:32:38.000000Z",
        updated_by: "satham hussain",
        user_id: 3,
        work_phone: "3331112222",
    }
  }

  ngOnInit(): void {
  }


  goToList() {
    this.router.navigate(['/pages/company']);
  }

  getFullAddress() {
    const c = this.company
    const address = [ c.address, c.city, c.state, c.country_id?.name ].join(', ')
    return address || '-'
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
