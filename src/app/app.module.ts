import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', loadChildren: () => import('./user-registration/user-registration.module').then(m => m.UserRegistrationModule)},
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: '', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) },
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,RouterModule.forRoot(routes),
    BrowserAnimationsModule,SharedModule,MatSnackBarModule
  ],
  providers: [],
  exports:[RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
