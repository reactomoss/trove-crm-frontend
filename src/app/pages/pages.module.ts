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
import { EditorModule } from "@tinymce/tinymce-angular";
import { TextEditorComponent } from './detail/text-editor/text-editor.component';
import { WidgetComponent } from './detail/widget/widget.component';
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
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { ContactFilterComponent } from './contact/filter/filter.component';
import { ContactComponent, MailDialog } from './contact/contact.component';
import { ContactTableComponent } from './contact/contact-table/contact-table.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { TaskComponent } from './task/task.component';
import { TaskFilterComponent } from './task/task-filter/task-filter.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CompanyComponent, CompanyMailDialog } from './company/company.component';
import { CompanyTableComponent } from './company/company-table/company-table.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import {CompanyFilterComponent} from './company/filter/filter.component';
import { EditnoteComponent } from './editnote/editnote.component';
import { AddnoteComponent } from './addnote/addnote.component';
import { SourcechartComponent } from './sourcechart/sourcechart.component';
import { SourceFilterComponent } from './sourcechart/source-filter/source-filter.component';
import { SourceTableComponent } from './sourcechart/source-table/source-table.component';
import { ActivitylogComponent } from './activitylog/activitylog.component';
import { ActivitylistComponent } from './detail/activitylist/activitylist.component';
import { ContactActivitylistComponent } from './contact-detail/contact-activitylist/contact-activitylist.component';
import { CompanyActivitylistComponent } from './company-detail/company-activitylist/company-activitylist.component';
import { RolesComponent } from './settings/usersroles/roles/roles.component';

//canActivate:[AuthGuardService]
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PagesComponent, canActivate:[AuthGuardService]},
  // {path:'settings' , loadChildren: () => import('./settings/settings.module') .then(m=>m.SettingsModule)},
  { path: 'settings', component: SettingsComponent, canActivate:[AuthGuardService]},
  { path: 'leads', component: LeadsComponent, canActivate:[AuthGuardService]},
  { path: 'lead_detail', component: DetailComponent, canActivate:[AuthGuardService]},
  { path: 'contact', component: ContactComponent, canActivate:[AuthGuardService]},
  { path: 'contact_detail', component: ContactDetailComponent, canActivate:[AuthGuardService]},
  { path: 'task', component: TaskComponent, canActivate:[AuthGuardService]},
  { path: 'company', component: CompanyComponent, canActivate:[AuthGuardService]},
  { path: 'company_detail', component: CompanyDetailComponent, canActivate:[AuthGuardService]},
  { path: 'addnote', component: AddnoteComponent, canActivate:[AuthGuardService]},
  { path: 'editnote', component: EditnoteComponent, canActivate:[AuthGuardService]},
  { path: 'sourcedetail' , component: SourcechartComponent, canActivate:[AuthGuardService]},
  { path: 'activities', component: ActivitylogComponent, canActivate:[AuthGuardService]},
]
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
    PlanspricingComponent,
    ContactFilterComponent,
    ContactComponent,
    ContactTableComponent,
    MailDialog,
    ContactDetailComponent,
    TaskComponent,
    TaskFilterComponent,
    CompanyComponent,
    CompanyTableComponent,
    CompanyDetailComponent,
    CompanyFilterComponent,
    CompanyMailDialog,
    EditnoteComponent,
    AddnoteComponent,
    SourcechartComponent,
    SourceFilterComponent,
    SourceTableComponent,
    ActivitylogComponent,
    ActivitylistComponent,
    ContactActivitylistComponent,
    CompanyActivitylistComponent
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
    EditorModule,
    SimplebarAngularModule,
    NgxSliderModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgxMaterialTimepickerModule,
  ],
  exports: [RouterModule],
})
export class PagesModule {}
