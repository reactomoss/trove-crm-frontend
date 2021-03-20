import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, LeadDialog } from './header/header.component';
import { RouterModule,Routes } from '@angular/router';
import { DemoMaterialModule } from '../material/material-module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [

]
 
@NgModule({
  declarations: [HeaderComponent, LeadDialog],
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [
    HeaderComponent,
    RouterModule
  ]
})
export class SharedModule { }
