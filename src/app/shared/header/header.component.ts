import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isNotification:boolean = false
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
