import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  apiResponse: any;
  clicked = false;
  hide = true;

  constructor(
    public formBuilder: FormBuilder,
    private account: AccountApiService,
    private router: Router) { }

  ngOnInit(): void {
  }

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
    } else{
      this.clicked = true;
      this.account.login(this.loginForm.value).subscribe(
        (response) => {
          this.clicked = false;
          this.apiResponse = response;
          localStorage.setItem('token', response.data.token);
        },
        (err) => {
          this.clicked = false;
          this.apiResponse = err.error;
          /*if (err.error.code === 251) {
            const formControl = this.loginForm.get('email');
            if (formControl) {
              formControl.setErrors({
                serverError: err.error.message,
              });
            }
          }*/
        }
      )
    }
  }

  /*email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter the email address';
    }

    return this.email.hasError('email') ? 'Please enter a valid email address' : '';
  }*/
}
