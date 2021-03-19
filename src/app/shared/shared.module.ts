import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule,Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
 const routes : Routes = [

 ]
@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),MaterialModule
  ],
  exports: [HeaderComponent,RouterModule]
})
export class SharedModule { }
