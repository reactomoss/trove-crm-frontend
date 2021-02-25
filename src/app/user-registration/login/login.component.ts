import { TokenService } from './../../services/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  apiResponse: any;
  clicked = false;
  hide = true;
  infoMessage = '';
  infoStatus = 'alertBox';

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private account: AccountApiService,
    private token: TokenService
  ) {
    if (account.isLoggedIn()) {
      router.navigate(['pages/dashboard']);
    }
    this.loginForm.valueChanges.subscribe((data) => {
      //console.log("value change");
      this.apiResponse = false;
    });
    this.route.queryParams
      .subscribe(params => {
        if(params.logout !== undefined && params.logout === 'true') {
            this.infoMessage = 'Logged out successfully.';
        } else if(params.reset !== undefined && params.reset === 'true'){
          this.infoMessage = 'Password changed successfully.';
        } else if(params.resettoken !== undefined && params.resettoken === 'false'){
          this.infoMessage = 'Password reset token is invalid/expired.';
          this.infoStatus = 'alertBoxError';
        }
      });
  }

  ngOnInit(): void {}

  loginForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
        ),
      ],
    ],
  });

  // Submit Registration Form
  onSubmit() {
    if (!this.loginForm.valid) {
      return false;
    } else {
      this.clicked = true;
      this.account.login(this.loginForm.value).subscribe(
        (response) => {
          this.clicked = false;
          this.apiResponse = response;
          this.token.handle(response.data.token);
          this.router.navigate(['pages/dashboard']);
        },
        (err) => {
          this.clicked = false;
          this.apiResponse = err.error;
        }
      );
    }
  }
}
