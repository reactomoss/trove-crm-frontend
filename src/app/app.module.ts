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
import {MatMenuModule} from '@angular/material/menu';
import {SharedModule} from './shared/shared.module';
const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
{path: 'user', loadChildren: () => import('./user-registration/user-registration.module').then(m => m.UserRegistrationModule)},
{path:'pages' , loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
{path: '' , loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)}
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,RouterModule.forRoot(routes),FormsModule,ReactiveFormsModule,
    BrowserAnimationsModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatIconModule,SharedModule,MatMenuModule
  ],
  providers: [],
  exports:[RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
