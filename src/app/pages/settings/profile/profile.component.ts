import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { SnackBarService } from '../../../shared/snack-bar.service';
import {SettingsApiService} from 'src/app/services/settings-api.service';
import{UserProfile} from './user-profile';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  /*Browse File*/
  private subscriptions: Subscription[] = [];
  profile: File = null;
  userData: UserProfile;
  imageUrl: string | ArrayBuffer = '../../../assets/images/settingsProfile.png';
  /*Browse File*/
  changePasswordForm: FormGroup;
  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }
  closeResult = '';
  profileForm: FormGroup;

  //  constructor starts
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService
  ) {
    // this.changePassword();
  }
  //  constructor ends

  //defining method for display of SnackBar
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
  /*Modal dialog*/
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'dialog001' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /*Modal dialog*/

  profilePicture(event) {
    this.profile = event.target.files[0];
  }
  removeProfilePicture() {
    this.profile = null;
    this.imageUrl = '../../../assets/images/settingsProfile.png';
  }
  onChangeProfile(profile: File) {
    if (profile) {
      this.profile = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = (event) => {
        this.imageUrl = reader.result;
      };
    }
  }

  ngOnInit(): void {
    // this.account
    //   .me()
    //   .then((res: any) => {
    //     //console.log(JSON.stringify(data));
    //     console.log(res);
    //     this.userData = res;
    //   })
    //   .catch((error) => {
    //     console.log('Promise rejected with ' + JSON.stringify(error));
    //   });

    const subs_query_param_get = this.settingsApiService.accountMe().subscribe((res:any) => {
           console.log(res);
           this.userData = res.data;
    });
    this.subscriptions.push(subs_query_param_get);
  }

  createProfileForm(){
    this.profileForm = this.fb.group({
      email: [
        this.userData.email,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      first_name: [
        this.userData.first_name,
        [
          Validators.required
        ],
      ],
      last_name: [
        this.userData.last_name,
        [
          Validators.required
        ],
      ]
    });
    this.profileForm.controls.email.disable();
  }

  updateProfile(){
    const data = this.profileForm.value;
    const subs_query_param = this.settingsApiService.updateProfile(data).subscribe((res: any) => {
      this.triggerSnackBar(res.message, 'Close');
      // this.userData = res.data;
      this.userData.first_name = data.first_name;
      this.userData.last_name = data.last_name;
      this.modalService.dismissAll();
    });
    this.subscriptions.push(subs_query_param);
  }

  updateChangePassword(){
    const data = this.changePasswordForm.value;
    this.settingsApiService.changePassword(data).subscribe((res: any) => {
      this.triggerSnackBar(res.message, 'Close');
      this.modalService.dismissAll();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

}
