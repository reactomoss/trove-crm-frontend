import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterModule , Routes } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
const routes: Routes = [
  {path:'', component:ForgotPasswordComponent}
]


@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),MatButtonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatIconModule
  ],
  exports:[RouterModule]
})
export class ForgotPasswordModule { }
