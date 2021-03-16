import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
<<<<<<< HEAD
import { SettingsComponent } from './settings/settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PagesComponent, canActivate:[AuthGuardService]},
  { path: 'settings', component: SettingsComponent, canActivate:[AuthGuardService]},
];
@NgModule({
  declarations: [PagesComponent, SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatTabsModule,
=======
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
>>>>>>> 2ec1ff25676db44e4837d1980ec19af6533dc857
  ],
  exports: [RouterModule],
})
export class PagesModule {}
