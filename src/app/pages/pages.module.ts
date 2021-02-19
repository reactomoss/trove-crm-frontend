import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule ,  Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { MatTabsModule } from "@angular/material/tabs";
const routes : Routes = [
  {path:'' , redirectTo: 'dashboard' , pathMatch:'full'},
{path: 'dashboard' , component:PagesComponent},
{path:'settings' , component:SettingsComponent}
]
@NgModule({
  declarations: [PagesComponent , SettingsComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule, MatTabsModule
  ],
  exports:[RouterModule],
})
export class PagesModule { }
