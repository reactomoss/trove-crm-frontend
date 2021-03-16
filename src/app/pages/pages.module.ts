import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule ,  Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { MatTabsModule } from "@angular/material/tabs";
import { LeadsComponent } from './leads/leads.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { LeadTableComponent } from './leads/lead-table/lead-table.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PagesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'leads', component: LeadsComponent },
]

@NgModule({
  declarations: [
    PagesComponent,
    SettingsComponent,
    LeadsComponent,
    LeadTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,

    MatTabsModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatSidenavModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  exports:[RouterModule],
})
export class PagesModule { }
