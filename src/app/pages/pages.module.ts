import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule ,  Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { LeadsComponent } from './leads/leads.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LeadTableComponent } from './leads/lead-table/lead-table.component';
import { DetailComponent, StageDialog, EditDialog, ConfirmDialog, TaskDialog, AppointDialog, StageSnack } from './detail/detail.component';
import { DemoMaterialModule } from '../material/material.module';
import { EditorModule } from "@tinymce/tinymce-angular";
import { TextEditorComponent } from './detail/text-editor/text-editor.component';
import { WidgetComponent } from './detail/widget/widget.component';
import { FilterComponent } from './leads/filter/filter.component';
import { ContactFilterComponent } from './contact/filter/filter.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { ContactComponent, MailDialog } from './contact/contact.component';
import { ContactTableComponent } from './contact/contact-table/contact-table.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PagesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'contact', component: ContactComponent },
]

@NgModule({
  declarations: [
    PagesComponent,
    SettingsComponent,
    LeadsComponent,
    LeadTableComponent,
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
    ContactFilterComponent,
    ContactComponent,
    ContactTableComponent,
    MailDialog
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    DemoMaterialModule,
    EditorModule,
    SimplebarAngularModule,
    NgxSliderModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  exports:[RouterModule],
})
export class PagesModule { }
