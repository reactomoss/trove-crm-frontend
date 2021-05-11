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
import { Moment } from 'moment';

export interface Appointment {
  id: string,
  title: string,
  where: string
  description: string
  start_date: Moment,
  start_time: string,
  end_date: Moment,
  end_time: string,
  contact: string,
  remainder_date: string,
  remainder_time: string,
}

@Component({
  selector: 'appoint-dialog',
  templateUrl: 'appoint-dialog.html',
  styleUrls: ['appoint-dialog.css'],
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
export class AppointDialog {
  myControl = new FormControl();
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
  isEdit: boolean = false;
  showAuto: boolean = true
  active: number = 1
  
  appointment: Appointment = {
    id: null,
    title: "",
    where: "",
    description: "",
    start_date: null,
    start_time: null,
    end_date: null,
    end_time: null,
    contact: null,
    remainder_date: null,
    remainder_time: null,
  }

  constructor(
    public dialogRef: MatDialogRef<AppointDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('appoint-dialog', data)
    this.isEdit = data.isEdit
    if (data.appointment) {
      this.appointment = data.appointment
    }    
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
    );
  }

   setEmpty(){
    this.myControl.setValue('')
   }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onDelete(): void {
    this.dialogRef.close({
      action: 'delete',
      appointment: this.appointment
    })
  }

  onConfirm() : void {
    console.log('appointment:', this.appointment)
    this.dialogRef.close({
      action: 'update',
      appointment: this.appointment
    })
  }

  deleteSelected(e) {
    const index = this.selected.indexOf(e)
    this.selected.splice(index, 1)
    this.selected.length == 0 && (this.showAuto = true)
  }
}
