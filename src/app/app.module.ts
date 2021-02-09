import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
{path: 'user', loadChildren: () => import('./user-registration/user-registration.module').then(m => m.UserRegistrationModule)}
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,RouterModule.forRoot(routes),FormsModule,ReactiveFormsModule,
    BrowserAnimationsModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatIconModule
  ],
  providers: [],
  exports:[RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
