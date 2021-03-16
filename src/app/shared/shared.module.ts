import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule,Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { SnackbarBCComponent } from './snackbar-bc/snackbar-bc.component';

 const routes : Routes = [

 ]
@NgModule({
  declarations: [HeaderComponent, SnackbarBCComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),MaterialModule
  ],
  exports: [HeaderComponent,RouterModule,SnackbarBCComponent]
})
export class SharedModule { }
