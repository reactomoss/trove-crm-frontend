import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { SettingsApiService } from 'src/app/services/settings-api.service';
import {
  TIMEFORMATS,
  TIMEZONES,
  DATEFORMATS,
  CURRENCYFORMATS,
  PREFERENCEDATA,
} from './preference-data';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, AfterViewInit {

  userProfile = JSON.parse(localStorage.getItem('me'));
  account_id = this.userProfile.account_id;

  timeZonesData = [];
  timeFormatsData= [];
  dateFormatsData= [];
  currencyFormatsData= [];
  preferenceData = [];
  accountForm: FormGroup;
  private subscriptions: Subscription[] = [];

  time = new Date();
  intervalId;
  /*For Account -- time zone select box*/
  constructor(
    private settingsApiService: SettingsApiService,
    private sb: SnackBarService,
    private fb: FormBuilder
  ) {
    this.accountForm = new FormGroup({
      time_zone: new FormControl(),
      time_format: new FormControl(),
      date_format: new FormControl(),
      currency: new FormControl(),
    });
  }
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
  ngOnInit(): void {
    console.log('  ChildComponent==>ngOnInit');
    // Using Basic Interval
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    const subs_query_param_get = this.settingsApiService.preferenceMe().subscribe(
      (res: any) => {
        console.log(res);
        this.timeZonesData = res.data.timezones;
        this.timeFormatsData = res.data.timeformats;
        this.dateFormatsData = res.data.deteformats;
        this.currencyFormatsData = res.data.currencies;
        this.preferenceData = res.data.preference;

        this.accountForm = this.fb.group({
          time_zone: [this.preferenceData ? res.data.preference.timezone_id : ''],
          time_format: [this.preferenceData ? res.data.preference.timeformat_id : ''],
          date_format: [this.preferenceData ? res.data.preference.dateformat_id : ''],
          currency: [this.preferenceData ? res.data.preference.currency_id : '']
        });
      },
      (errorResponse: HttpErrorResponse) => {
        //console.log(errorResponse);
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        console.log(messages);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
    this.subscriptions.push(subs_query_param_get);
  }
  ngAfterViewInit() {
    console.log('ChildComponent==>AfterViewInit');
  }
  ngAfterContentInit() {
    console.log('  ChildComponent==>ngAfterContentInit');

  }
  /*createPreferenceForm(){


  }*/

  updatePreference() {
    const data = this.accountForm.value;
    console.log(data);
    const subs_query_param = this.settingsApiService
      .updatePreference(data)
      .subscribe((res: any) => {
        this.triggerSnackBar(res.message, 'Close');
      },
      (errorResponse: HttpErrorResponse) => {
        //console.log(errorResponse);
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        console.log(messages);
        this.triggerSnackBar(messages.toString(), 'Close');
      });
    this.subscriptions.push(subs_query_param);
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
    clearInterval(this.intervalId);
    console.log(this.subscriptions);
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
