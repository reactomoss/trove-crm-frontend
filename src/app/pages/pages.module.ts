import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule ,  Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
const routes : Routes = [
  {path:'' , redirectTo: 'dashboard' , pathMatch:'full'},
{path: 'dashboard' , component:PagesComponent},
{path:'settings' , loadChildren: () => import('./settings/settings.module') .then(m=>m.SettingsModule)}
]
@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule, NgbModule
  ],
  exports:[RouterModule],
})
export class PagesModule { }
