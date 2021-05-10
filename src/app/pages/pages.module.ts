import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuardService } from '../services/auth-guard.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LeadsComponent } from './leads/leads.component';
import { LeadTableComponent } from './leads/lead-table/lead-table.component';
import {MaterialModule} from '../material/material.module';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DetailComponent, StageDialog, EditDialog, ConfirmDialog, TaskDialog, AppointDialog, StageSnack } from './detail/detail.component';
import { DemoMaterialModule } from '../material/material-module';
import { EditorModule } from "@tinymce/tinymce-angular";
import { TextEditorComponent } from './detail/text-editor/text-editor.component';
import { WidgetComponent } from './detail/widget/widget.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FilterComponent } from './leads/filter/filter.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { UsersrolesComponent } from './settings/usersroles/usersroles.component';
import { AccountComponent } from './settings/account/account.component';
import { NotificationComponent } from './settings/notification/notification.component';
import { DragdropDirective } from './settings/data/dragdrop.directive';
import { DataComponent } from './settings/data/data.component';
import { PipelinestagesComponent } from './settings/pipelinestages/pipelinestages.component';
import { TermsservicesComponent } from './settings/termsservices/termsservices.component';
import { PrivacypolicyComponent } from './settings/privacypolicy/privacypolicy.component';
import { PlanspricingComponent } from './settings/planspricing/planspricing.component';
import { RolesComponent } from './settings/usersroles/roles/roles.component';
const routes: Routes = [
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PagesComponent, canActivate:[AuthGuardService]},
  //{ path: 'settings', loadChildren: () => import('./settings/settings.module') .then(m=>m.SettingsModule), canActivate:[AuthGuardService]},
  { path: 'settings', component: SettingsComponent},
  { path: 'leads', component: LeadsComponent , canActivate:[AuthGuardService]},
  { path: 'detail', component: DetailComponent , canActivate:[AuthGuardService]},
  {path: '**', component: LeadsComponent}
];
@NgModule({
  declarations: [
    PagesComponent,LeadsComponent,LeadTableComponent,SettingsComponent,
    DetailComponent,
    StageDialog,
    EditDialog,
    TaskDialog,
    AppointDialog,
    ConfirmDialog,
    StageSnack,
    TextEditorComponent,
    WidgetComponent,
    FilterComponent,
    ProfileComponent,
    UsersrolesComponent,
    RolesComponent,
    AccountComponent,
    NotificationComponent,
    DragdropDirective,
    DataComponent,
    PipelinestagesComponent,
    TermsservicesComponent,
    PrivacypolicyComponent,
    PlanspricingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    DemoMaterialModule,
    EditorModule,
    NgxSliderModule
  ],
  exports: [RouterModule],
})
export class PagesModule {}
