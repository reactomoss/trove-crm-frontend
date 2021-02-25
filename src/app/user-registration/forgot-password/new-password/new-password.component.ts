import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountApiService } from './../../../services/account-api.service';
import { ConfirmedValidator } from './../../../services/confirmed.validator';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  public error = [];
  public form = {
    password: null,
    password_confirmation: null,
    reset_token: null
  }
  apiResponse: any;
  clicked = false;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private account: AccountApiService,
    ) {
      route.queryParams.subscribe(params => {
        this.form.reset_token = params['token'];
        this.account.validateResetPasswordToken(params['token']).subscribe(
          (response) => {
            this.apiResponse = response;
          },
          (err) => {
            console.log(err.error);
            this.router.navigate(['login'], {queryParams: { resettoken: 'false' } });
          }
        );
      });
      this.ResetPasswordForm.valueChanges.subscribe((data) => {
        //console.log("value change");
        this.apiResponse = false;
      });

    }

  ngOnInit(): void {
  }
  pwd = true;
  confirmPwd = true;

  ResetPasswordForm = this.formBuilder.group({
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
        ),
      ],
    ],
    password_confirmation: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
        ),
      ],
    ],
  }, {
    validator: ConfirmedValidator('password', 'password_confirmation')
  });

  onSubmit(){
    if (!this.ResetPasswordForm.valid) {
      return false;
    } else {
      this.clicked = true;
      this.form.password = this.ResetPasswordForm.get('password').value;
      this.form.password_confirmation = this.ResetPasswordForm.get('password_confirmation').value;
      console.log(this.form);

      this.account.resetPassword(this.form).subscribe(
        (response) => {
          this.clicked = false;
          this.router.navigate(['login'], {queryParams: { reset: 'true' } });
        },
        (err) => {
          this.clicked = false;
          this.apiResponse = err.error;
        }
      );
    }
  }

}
