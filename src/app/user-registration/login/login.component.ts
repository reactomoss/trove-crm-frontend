import { TokenService } from './../../services/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
import { extractErrorMessagesFromErrorResponse } from './../../services/extract-error-messages-from-error-response';
import { FormStatus } from './../../services/form-status';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  apiResponse: any;
  clicked = false;
  hide = true;
  infoMessage = '';
  infoStatus = 'alertBox';
  socialUser: SocialUser;
  isLoggedin: boolean;
  NavigationExtrasResponse:any;

  private subscriptions: Subscription[] = [];

  // 1 - Initialize a form status object for the component
  formStatus = new FormStatus();

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private account: AccountApiService,
    private token: TokenService,
    private socialAuthService: SocialAuthService
  ) {
    this.NavigationExtrasResponse = this.router.getCurrentNavigation().extras.state;
    //console.log(this.NavigationExtrasResponse);

    if (account.isLoggedIn()) {
      router.navigate(['pages/dashboard']);
    }
    const subs_valuechange = this.loginForm.valueChanges.subscribe((data) => {
      //console.log("value change");
      this.apiResponse = false;
    });


    const subs_query_param = this.route.queryParams
      .subscribe(params => {
        if(params.logout !== undefined && params.logout === 'true') {
            this.infoMessage = 'Logged out successfully.';
        } else if(params.reset !== undefined && params.reset === 'true'){
          this.infoMessage = 'Password changed successfully.';
        } else if(params.resettoken !== undefined && params.resettoken === 'false'){
          this.infoMessage = 'Password reset token is invalid/expired.';
          this.infoStatus = 'alertBoxError';
        } else if(params.verifyemail !== undefined && params.verifyemail === 'false'){
          this.infoMessage = 'Invalid token.';
          this.infoStatus = 'alertBoxError';
        } else if(params.verifyemail !== undefined && params.verifyemail === 'verified'){
          this.infoMessage = 'Email already verified.';
          this.infoStatus = 'alertBoxError';
        }
      });
      this.subscriptions.push(subs_valuechange);
      this.subscriptions.push(subs_query_param);
  }

  ngOnInit(): void {
    const sub_social_auth = this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      //console.log(this.isLoggedin);
      this.formStatus.onFormSubmitting();
      if ( this.socialUser && typeof this.socialUser.email !== 'undefined') {
        let postData = {
          email: this.socialUser.email,
          platform: 'web',
          type: this.socialUser.provider,
          social_user_id: this.socialUser.id,
        };
        //console.log(postData);
        const sub_social = this.account.login(postData).subscribe(
          (response) => {
            this.apiResponse = response;
            this.token.handle(response.data.token);
            this.formStatus.onFormSubmitResponse({
              success: true,
              messages: [],
            });
            this.logOut();
            this.router.navigate(['pages/dashboard']);
          },
          (errorResponse: HttpErrorResponse) => {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            this.formStatus.onFormSubmitResponse({
              success: false,
              messages: messages,
            });
            this.logOut();
          }
        );
        this.subscriptions.push(sub_social);
      } else {
        this.logOut();
        this.formStatus.onFormSubmitResponse({
          success: false,
          messages: ['Your social media doesn\'t have email, so kindly signup with email.']
        });
      }
    });
    this.subscriptions.push(sub_social_auth);
  }

  /*##################### Google Auth #####################*/
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    if(this.isLoggedin){
      this.socialAuthService.signOut();
    }
  }

  /*##################### Login Form #####################*/

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
    platform:"",
    type: ""
  });

  // Submit Registration Form
  onSubmit() {
    if (!this.loginForm.valid) {
      return false;
    } else {
      this.clicked = true;
      this.formStatus.onFormSubmitting();
      this.loginForm.patchValue({ platform: 'web', type: 'form' });
      const subs_form = this.account.login(this.loginForm.value).subscribe(
        (response) => {
          this.clicked = false;
          this.apiResponse = response;
          this.token.handle(response.data.token);
          this.router.navigate(['pages/dashboard']);
        },
        (errorResponse: HttpErrorResponse) => {
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          // call onFormSubmitResponse with the submission success status (false) and the array of messages
          this.formStatus.onFormSubmitResponse({
            success: false,
            messages: messages,
          });
        }
      );
      this.subscriptions.push(subs_form);
    }
  }
  ngOnDestroy() {
    //console.log("ngOnDestroy")
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    if(this.isLoggedin){
      this.logOut();
    }
  }
}
