import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { ContactApiService } from 'src/app/services/contact-api.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import * as moment from 'moment';

export interface Appointment {
  id: string,
  title: string,
  location: string
  description: string
  start_date: Moment,
  start_time: string,
  end_date: Moment,
  end_time: string,
  contact: string,
  reminder_date: Moment,
  reminder_time: string,
}
export interface AppointOwner {
  id: number,
  type: string
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
  form: FormGroup;
  myControl = new FormControl();
  options: any[] = []
  filteredOptions: Observable<any[]>;

  selected: any[] = []
  isEdit: boolean = false;
  showAuto: boolean = true
  active: number = 1

  associate_members: any = {}
  appoint_owner: AppointOwner = null
  appointment: Appointment = {
    id: null,
    title: "Test",
    location: "France",
    description: "Test Appointment",
    start_date: moment('2021-06-15'),
    start_time: '09:00:00',
    end_date: moment('2021-06-20'),
    end_time: '22:20:00',
    contact: null,
    reminder_date: moment('2021-06-16'),
    reminder_time: '05:15:00',
  }
  errors = null

  constructor(
    private sb: SnackBarService,
    private contactService: ContactApiService,
    public dialogRef: MatDialogRef<AppointDialog>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('appoint-dialog', data)
    this.isEdit = data.isEdit
    data.appointment && (this.appointment = data.appointment);
    data.associate_members && (this.associate_members = data.associate_members);
    data.appoint_owner  && (this.appoint_owner = data.appoint_owner)
    this.setActive(1)
    this.setSelectedAssociate()
    this.reactiveForm()
  }

  reactiveForm() {
    const appoint = this.appointment
    this.form = this.fb.group({
      title: [appoint.title, [Validators.required, Validators.maxLength(100)]],
      location: [appoint.location, [Validators.required]],
      description: [appoint.description, [Validators.required, Validators.maxLength(500)]],
      start_date: [
        appoint.start_date ? moment(appoint.start_date) : null,
        [Validators.required]
      ],
      start_time: [
        appoint.start_time ? moment(appoint.start_time, ["h:mm A"]).format('h:mm A') : null,
        [Validators.required]
      ],
      end_date: [
        appoint.end_date ? moment(appoint.end_date) : null,
        [Validators.required]
      ],
      end_time: [
        appoint.end_time ? moment(appoint.end_time, ["h:mm A"]).format('h:mm A') : null,
        [Validators.required]
      ],
      reminder_date: [
        appoint.reminder_date ? moment(appoint.reminder_date) : null,
        [Validators.required]
      ],
      reminder_time: [
        appoint.reminder_time ? moment(appoint.reminder_time, ["h:mm A"]).format('h:mm A') : null,
        [Validators.required]
      ],
    });
  }

  hasValidationError(key) {
    return this.form.controls[key].invalid && this.form.controls[key].errors;
  }

  getValidationMessage(key) {
    const control = this.form.controls[key];
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('pattern')) {
      if (control.errors.pattern.requiredPattern == '^[0-9]*$')
        return 'Please input numbers only';
    }
    if (control.hasError('minlength'))
      return `The minimum length is ${control.errors.minlength.requiredLength}.`;
    if (control.hasError('maxlength'))
      return `The minimum length is ${control.errors.maxlength.requiredLength}.`;
    if (control.hasError('invalidreminder'))
      return `Reminder date time must be a date before start date time`
    return '';
  }


  private getEventDate(day: moment.Moment, time: string) {
    const date = day ? moment(day) : moment()
    if (time) {
      var tm = moment(time, ["h:mm A"])
      date.add(tm.hours(), 'hours').add(tm.minutes(), 'minutes')
    }
    return date
  }
  
  submitForm() : void {
    console.log('submit', this.form.value);
    if (!this.form.valid) {
      return;
    }

    const values = this.form.value
    const startDate = this.getEventDate(values.start_date, values.start_time)
    const reminderDate = this.getEventDate(values.reminder_date, values.reminder_time)
    if (startDate < reminderDate) {
      this.form.controls['reminder_date'].setErrors({'invalidreminder': true});
      return
    }

    const payload = {
      ...this.form.value,
      start_date: values.start_date.format('YYYY-MM-DD'),
      end_date: values.end_date.format('YYYY-MM-DD'),
      reminder_date: values.reminder_date.format('YYYY-MM-DD'),
    };

    if (this.isEdit) {
      payload['id'] = this.appointment.id
    }

    if (this.selected && this.selected.length > 0) {
      const appointments = {}
      const contacts = this.selected.filter(e => e.type == 'contact').map(e => e.id)
      if (contacts.length > 0) {
        appointments['contacts'] = contacts
      }

      const companies = this.selected.filter(e => e.type == 'company').map(e => e.id)
      if (companies.length > 0) {
        appointments['organizations'] = companies
      }

      const leads = this.selected.filter(e => e.type == 'lead').map(e => e.id)
      if (leads.length > 0) {
        appointments['leads'] = leads
      }

      if (Object.keys(appointments).length > 0) {
        payload['appointment_to'] = appointments
      }
    }
    console.log('submit-payload', payload);

    const observable = this.isEdit ?
        this.contactService.updateAppointment(this.appointment.id, payload) :
        this.contactService.createAppointment(payload)

    observable.subscribe(
      (res: any) => {
        if (res.success) {
          this.dialogRef.close({
            state: this.isEdit? 'updated' : 'created',
            message: res.message,
          });
        }
        else {
          this.sb.openSnackBarBottomCenter(res.message, 'Close');
        }
      },
      (err) => {
        this.errors = {};
        const data = err.error.data;
        for (const key in data) {
          if (Array.isArray(data[key])) this.errors[key] = data[key][0];
          else this.errors[key] = data[key];
        }
        console.log('this.errors', this.errors);
        const messages = Object.values(this.errors).join('\r\n');
        this.sb.openSnackBarTopCenterAsDuration(messages, 'Close', 4000);
      }
    );
  }

  private _filter(value: any): string[] {
    if (value && typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.options
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

  private getContacts() {
    return this.associate_members.contacts.map(item => {
      return {type: 'contact', id: item.id, name: item.full_name, desc: item.email, icon: 'person'}
    })
  }

  private getOrganizations() {
    return this.associate_members.organizations.map(item => {
      return {type: 'company', id: item.id, name: item.name, desc: item.email, icon: 'business'}
    })
  }

  private getLeads() {
    return this.associate_members.leads.map(item => {
      return {type: 'lead', id: item.id, name: item.name, desc: '', icon: 'leaderboard'}
    })
  }

  public setActive(num) {
    this.active = num

    if (num == 1) this.options = this.getContacts()
    else if (num == 2) this.options = this.getOrganizations()
    else if (num == 3) this.options = this.getLeads()
    this.options = this.options.filter(item => !this.isMainOwner(item))

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

  isMainOwner(item) {
    return (item.type == this.appoint_owner.type && item.id == this.appoint_owner.id)
  }

  private setSelectedAssociate() {
    let items = null
    if (this.appoint_owner.type == 'company') {
      items = this.getOrganizations()
    }
    else if (this.appoint_owner.type == 'contact') {
        items = this.getOrganizations()
    }
    else if (this.appoint_owner.type == 'lead') {
        items = this.getOrganizations()
    }
    if (items) {
      this.selected.push(items.find(it => it.id == this.appoint_owner.id));
    }
  }

  deleteSelected(e) {
    const index = this.selected.indexOf(e)
    this.selected.splice(index, 1)
    this.selected.length == 0 && (this.showAuto = true)
  }
}
