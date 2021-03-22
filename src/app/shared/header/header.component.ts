import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isNotification: boolean = false;
  menus: any[];
  constructor(
    private router: Router,
    private account: AccountApiService,
    private token: TokenService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.menus = [
      {
        icon: 'menu001.png',
        link: '/pages/dashboard',
      },
      {
        icon: 'menu006.png',
        link: '/pages/leads',
      },
      {
        icon: 'menu002.png',
        link: '/pages/contact',
      },
      {
        icon: 'menu003.png',
        link: '/pages/email',
      },
      {
        icon: 'menu004.png',
        link: '/pages/calendar',
      },
      {
        icon: 'menu005.png',
        link: '/pages/pipeline',
      },
    ];
  }
  showNotification() {
    this.isNotification = !this.isNotification;
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
      width: '570px',
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}


@Component({
  selector: 'lead-dialog',
  templateUrl: 'lead-dialog/lead-dialog.html',
  styleUrls: ['lead-dialog/lead-dialog.css']
})
export class LeadDialog {

  showMandatory: boolean = false
  search: string = ''

  constructor(
    public dialogRef: MatDialogRef<LeadDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked
  }

  checkShow(name) {
    if (!this.search)
      return true
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false
    else
      return true
  }
}
