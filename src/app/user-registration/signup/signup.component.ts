import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  apiResponse: any;
  clicked = false;
  hide = true;

  constructor(
    public fb: FormBuilder,
    private account: AccountApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /*##################### Registration Form #####################*/

  registrationForm = this.fb.group({
    first_name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
        //Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
      ],
    ],
    last_name: ['', [Validators.maxLength(255)]],
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
    company_name: ['', [Validators.maxLength(255)]],
    no_of_employees: '',
  });

  // Submit Registration Form
  onSubmit() {
    if (!this.registrationForm.valid) {
      console.log(this.registrationForm.controls.first_name.errors);
      return false;
    } else {
      this.clicked = true;
      //console.log(this.registrationForm.value);
      this.account.createAccount(this.registrationForm.value).subscribe(
        (response) => {
          this.clicked = false;
          this.apiResponse = response;
          localStorage.setItem('token', response.data.token);
          this.router.navigate(['pages/dashboard']);
        },
        (err) => {
          //alert("error");
          this.clicked = false;
          if (err.error.code === 253) {
            const validationErrors = { email: err.error.message };

            Object.keys(validationErrors).forEach((prop) => {
              const formControl = this.registrationForm.get(prop);
              if (formControl) {
                formControl.setErrors({
                  serverError: validationErrors[prop],
                });
              }

              // TODO: consider adding the error to some data structure
              // and visualize it as an alert/notification to the user
              // in addition to activating the errors on the form.

              // errorMessages.push({
              //   propName: prop,
              //   errors: validationErrors[prop]
              // });
            });
          }
        }
      );
    }
  }
}
