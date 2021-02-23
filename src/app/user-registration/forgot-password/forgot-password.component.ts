import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountApiService } from 'src/app/services/account-api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  clicked = false;
  hide = true;

  constructor(
    public formBuilder: FormBuilder,
    private account: AccountApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  forgotPasswordForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
  });

  // Submit Registration Form
  onSubmit() {
    if (!this.forgotPasswordForm.valid) {
      return false;
    } else {
      this.clicked = true;
      this.account.sendPasswordResetLink(this.forgotPasswordForm.controls['email'].value).subscribe(
        (response) => {
          this.clicked = false;
          this.router.navigate(['/user/forgot-password/reset-email']);
        },
        (err) => {
          this.clicked = false;
          if (err.error.code === 254) {
            const formControl = this.forgotPasswordForm.get('email');
            if (formControl) {
              formControl.setErrors({
                serverError: err.error.message,
              });
            }
          }
        }
      );
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
