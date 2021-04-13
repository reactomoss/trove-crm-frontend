import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import {SettingsApiService} from 'src/app/services/settings-api.service';
import {TIMEFORMATS, TIMEZONES, DATEFORMATS, CURRENCYFORMATS, PREFERENCEDATA} from './preference-data';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  timeZonesData: TIMEZONES[];
  timeFormatsData: TIMEFORMATS[];
  dateFormatsData: DATEFORMATS[];
  currencyFormatsData: CURRENCYFORMATS[];
  preferenceData: PREFERENCEDATA;
accountForm: FormGroup;
private subscriptions: Subscription[] = [];
/*For Account -- time zone select box*/
  constructor(
    private settingsApiService: SettingsApiService,
    private sb: SnackBarService,
    private fb: FormBuilder,
  ) {
    this.accountForm = new FormGroup({
      time_zone: new FormControl(),
      time_format: new FormControl(),
      date_format: new FormControl(),
      currency: new FormControl()
    });
  }
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
  ngOnInit(): void {
    const subs_query_param_get = this.settingsApiService.preferenceMe().subscribe((res:any) => {
            console.log(res);
            this.timeZonesData = res.data.timezones;
            this.timeFormatsData = res.data.timeformats;
            this.dateFormatsData = res.data.deteformats;
            this.currencyFormatsData = res.data.currencies;
            this.preferenceData = res.data.preference;
            this.createPreferenceForm();
      });
      this.subscriptions.push(subs_query_param_get);
  }


  createPreferenceForm(){
    this.accountForm = this.fb.group({
      time_zone: [this.preferenceData ? this.preferenceData.timezone_id : ''],
      time_format: [this.preferenceData ? this.preferenceData.timeformat_id : ''],
      date_format: [this.preferenceData ? this.preferenceData.dateformat_id : ''],
      currency: [this.preferenceData ? this.preferenceData.currency_id : '']
    });

  }

  updatePreference(){
    const data = this.accountForm.value;
    const subs_query_param = this.settingsApiService.updatePreference(data).subscribe((res: any) => {
      console.log(res);
      this.triggerSnackBar(res.message, 'Close');
    });
    this.subscriptions.push(subs_query_param);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

}
