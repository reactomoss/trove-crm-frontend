import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'task-dialog',
  templateUrl: 'task-dialog.html',
  styleUrls: ['task-dialog.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class TaskDialog {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  myControl = new FormControl()
  options: any[] = [
    {
      name: "Person", description: "One", icon: "person"
    },
    {
      name: "Person", description: "Two", icon: "person"
    },
    {
      name: "Person", description: "Three", icon: "person"
    }
    ]
  filteredOptions: Observable<any[]>;

  selected: any[] = []
  showAuto: boolean = true
  isEdit: boolean = false;
  active: number = 1

  constructor(
    public dialogRef: MatDialogRef<TaskDialog>,
     @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data.isEdit;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
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
      this.options = [{
        name: "Person", description: "One", icon: "person"
      },
      {
        name: "Person", description: "Two", icon: "person"
      }
      ,
      {
        name: "Person", description: "Three", icon: "person"
      }]
    } else if (num == 2) {
      this.options = [{
        name: "Company", description: "One", icon: "business"
      },
      {
        name: "Company", description: "Two", icon: "business"
      }
      ,
      {
        name: "Company", description: "Three", icon: "business"
      }]
    } else if (num == 3) {
      this.options = [{
        name: "Leads", description: "One", icon: "leaderboard"
      },
      {
        name: "Leads", description: "Two", icon: "leaderboard"
      }
      ,
      {
        name: "Leads", description: "Three", icon: "leaderboard"
      }]
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }

  setEmpty(){
    this.myControl.setValue('');
   }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteSelected(e) {
    const index = this.selected.indexOf(e)
    this.selected.splice(index, 1)
    this.selected.length == 0 && (this.showAuto = true)
  }
}