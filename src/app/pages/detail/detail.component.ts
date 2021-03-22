import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  stages: string[];
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  
  constructor(private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.stages = ["Sales Pipeline", "Discovery", "Qualified", "Evolution", "Negotiation", "Closed"]
  }

  goToList() {
    this.router.navigate(['/pages/leads']);
  }
  
  getStageClass(i) {
    if (i == 0) {
      return "stage-active stage-item"
    } else {
      return "stage-item"
    }
  }

  openStageDialog(): void {
    const dialogRef = this.dialog.open(StageDialog, {
      width: '470px',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data && result.data == 'create') {
        let stageName = result.name
        !stageName && (stageName = 'Demo')
        this.stages.push(stageName)

        this._snackBar.openFromComponent(StageSnack, {
          data: { name: stageName},
          panelClass: 'style-success',
          duration: 30000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        })
      }
    })
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditDialog, {
      width: '560px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result ', result)
      if (result && result.data && result.data == 'delete') {
        this.openConfirmDialog()
      }
    })
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '560px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      
    })
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '520px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      
    })
  }

  openAppointDialog() {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      
    })
  }
}

// Dialogs
@Component({
  selector: 'stage-dialog',
  templateUrl: 'stage-dialog/stage-dialog.html',
  styleUrls: ['stage-dialog/stage-dialog.css']
})
export class StageDialog {

  public stageName:string = "Demo"

  constructor(
    public dialogRef: MatDialogRef<StageDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close({data: 'cancel'});
  }

  onCreateClick() {
    console.log('stage name', this.stageName)
    this.dialogRef.close({data: 'create', name: this.stageName});
  }

}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog/edit-dialog.html',
  styleUrls: ['edit-dialog/edit-dialog.css']
})
export class EditDialog {

  showMandatory: boolean = false
  search: string = ''
  
  constructor(
    public dialogRef: MatDialogRef<EditDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  checkMandatory(e) {
    this.showMandatory = e.checked
  }

  onNoClick(): void {
    this.dialogRef.close({ data: 'cancel' })
  }

  onDeleteClick() {
    this.dialogRef.close({ data: 'delete' })
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

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog/confirm-dialog.html',
  styleUrls: ['confirm-dialog/confirm-dialog.css']
})
export class ConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'task-dialog',
  templateUrl: 'task-dialog/task-dialog.html',
  styleUrls: ['task-dialog/task-dialog.css']
})
export class TaskDialog {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  
  myControl = new FormControl()
  options: string[] = ['One', 'Two', 'Three']
  filteredOptions: Observable<string[]>;

  selected: string[] = []
  showAuto: boolean = true
  
  active: number = 1

  constructor(
    public dialogRef: MatDialogRef<AppointDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public onSelectionChange(event) {
    this.selected.push(event.option.value)
    this.showAuto = false
  }

  public clickAdd() {
    console.log('click add')
    this.showAuto = !this.showAuto
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
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'appoint-dialog',
  templateUrl: 'appoint-dialog/appoint-dialog.html',
  styleUrls: ['appoint-dialog/appoint-dialog.css']
})
export class AppointDialog {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  selected: string[] = []
  showAuto: boolean = true

  active: number = 1

  constructor(
    public dialogRef: MatDialogRef<AppointDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public onSelectionChange(event) {
    this.selected.push(event.option.value)
    this.showAuto = false
  }

  public clickAdd() {
    console.log('click add')
    this.showAuto = !this.showAuto
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'stage-snack',
  templateUrl: 'stage-snack/stage-snack.html',
  styleUrls: ['stage-snack/stage-snack.css']
})
export class StageSnack {
  constructor( 
    public snackBarRef: MatSnackBarRef<StageSnack>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}