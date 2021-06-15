import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { CompanyDialog } from 'src/app/shared/header/header.component';
import { TaskDialog } from '../detail/task-dialog/task-dialog';
import { AppointDialog } from '../detail/appoint-dialog/appoint-dialog';
import {SnackBarService} from 'src/app/shared/snack-bar.service'
import * as moment from 'moment'
import { ContactApiService } from 'src/app/services/contact-api.service';
import sample from './sample.company'

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit {
  @Input() company = null;
  @Output() backEvent = new EventEmitter()

  organization = null;
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  status = 'active';

  constructor(
    private contactService: ContactApiService,
    private sb: SnackBarService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // const data = this.router.getCurrentNavigation().extras.state;
    // console.log('detail-compnay:', data);
    // if (!data) {      
    //   this.router.navigate(['/pages/company'])
    // }
    // else {
    //   this.setCompany(data)
    // }
  }

  ngOnInit(): void {
    console.log('~~~~~~~~~~~~', this.company)
    this.organization = this.company.organization;
  }

  setCompany(data: any) {
    this.company = data;
    this.organization = this.company.organization;
  }

  goToList() {
    //this.router.navigate(['/pages/company']);
    this.backEvent.emit()
  }

  getFullAddress() {
    const c = this.organization;
    const address = [c.address, c.city, c.state, c.country_id?.name].filter(i => i).join(', ');
    return address || '-';
  }

  getCreatedDate() {
    const date = moment(this.organization.created_at);
    return date.format('DD MMM YYYY');
  }

  openTaskDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data: { isEdit: isEdit },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog sent: ${result}`);
    });
  }

  openAppointDialog(isEdit: boolean, appointment?: any) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data: { 
        isEdit: isEdit, 
        appointment: appointment,
        associate_members: this.company.associate_members,
        appoint_owner: { id: this.organization.id, type: 'company'}
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log(`Dialog sent: ${res}`);
      if (res) {
        this.sb.openSnackBarBottomCenter(res.message, 'Close');
        setTimeout(() => this.refreshCompany(), 50)
      }
    });
  }

  addAppointClicked(appoint) {
    console.log('addAppointClicked', appoint)
    const isEdit: boolean = (appoint !== undefined)
    this.openAppointDialog(isEdit, appoint)
  }

  appointStateChanged({appointment, checked}) {
    const payload = {
      id: appointment.id,
      associate_id: this.organization.id,
      status: checked ? 1 : 0,
    }
    this.contactService
      .updateAppointmentState(this.organization.id, payload)
      .subscribe((res: any) => {
        console.log('appointStateChanged', res);
        if (res.success) {
          
        }
      });
  }

  taskStateChanged({task, checked}) {
    const payload = {
      id: task.id,
      associate_id: this.organization.id,
      status: checked ? 1 : 0,
    }
    this.contactService
      .updateAppointmentState(this.organization.id, payload)
      .subscribe((res: any) => {
        console.log('appointStateChanged', res);
        if (res.success) {
          
        }
      });
  }

  refreshCompany() {
    this.contactService
      .getCompanyDetial(this.organization.id)
      .subscribe((res: any) => {
        console.log('refresh', res);
        if (res.success) {
          this.setCompany(res.data)
        }
      });
  }

  editCompany() {
    const openCreateCompanyDialog = () => {
      const dialogRef = this.dialog.open(CompanyDialog, {
        width: '560px',
        autoFocus: false,
        data: { isEdit: true, company: this.organization },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.sb.openSnackBarBottomCenter(result.message, 'Close');
          this.company.organization = result.company
          this.organization = result.company
        }
      });
    };

    if (this.contactService.companyData) {
      openCreateCompanyDialog();
      return;
    }

    this.contactService.getCompanies().subscribe((res: any) => {
      if (!res.success) {
        this.sb.openSnackBarBottomCenter(res.message, 'Close');
        return;
      }
      if (res.data.menu_previlages.create !== 1) {
        this.sb.openSnackBarBottomCenter("You don't have permission", 'Close');
        return;
      }
      this.contactService.companyData = res.data;
      openCreateCompanyDialog();
    });
  }

  companyStatusChanged(value) {
    console.log('companyStatusChanged', value)
    const payload = {
      id: this.organization.id,
      status_id: (value === 'Active') ? 1 : 2
    }
    this.contactService
      .updateCompanyState(this.organization.id, payload)
      .subscribe((res: any) => {
        this.sb.openSnackBarBottomCenter(res.message, 'Close');
      })
  }
}
