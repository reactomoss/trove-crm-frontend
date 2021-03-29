import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, LeadDialog, ContactDialog, CompanyDialog } from './header/header.component';
import { RouterModule,Routes } from '@angular/router';
import { DemoMaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [

]
 
@NgModule({
  declarations: [
    HeaderComponent,
    LeadDialog,
    ContactDialog,
    CompanyDialog
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    RouterModule
  ]
})
export class SharedModule { }
