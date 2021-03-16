import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule ,  Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LeadsComponent } from './leads/leads.component';
import { LeadTableComponent } from './leads/lead-table/lead-table.component';
import {MaterialModule} from '../material/material.module';
const routes : Routes = [
  {path:'' , redirectTo: 'dashboard' , pathMatch:'full'},
{path: 'dashboard' , component:PagesComponent},
{path:'settings' , loadChildren: () => import('./settings/settings.module') .then(m=>m.SettingsModule)},
{ path: 'leads', component: LeadsComponent },
]

@NgModule({
  declarations: [PagesComponent,LeadsComponent,LeadTableComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule, NgbModule,MaterialModule
  ],
  exports:[RouterModule],
})
export class PagesModule { }
