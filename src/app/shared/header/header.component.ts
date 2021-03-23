import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menus: any[];
  isNotification:boolean = false
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  active: number = 1
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
   this.menus=[
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
        link:'/pages/email'
      },
      {
        icon:'menu004.png',
        link:'/pages/calendar'
      },
      {
        icon:'menu005.png',
        link:'/pages/pipeline'
      }
    ]
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }

  public activeClass(num) {
    if (num == this.active)
      return 'activeBtn'
    else
      return ''
  }

  public setActive(num) {
    console.log('set active', num)
    this.active = num
    if (num == 1) {
      this.options = ['One', 'Two', 'Three']
    } else if (num == 2) {
      this.options = ['Four', 'Five', 'Six']
    } else if (num == 3) {
      this.options = ['Seven', 'Eight', 'Nine']
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }

  onSelectionChange(event) {

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


  showNotification(){
    this.isNotification = !this.isNotification
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
