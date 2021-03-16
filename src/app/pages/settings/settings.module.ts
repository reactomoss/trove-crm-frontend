import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule , Routes } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { DragdropDirective } from './dragdrop.directive';
const routes: Routes = [
  {path:'', component:SettingsComponent}
]
@NgModule({
  declarations: [SettingsComponent, DragdropDirective],
  imports: [
    CommonModule,RouterModule.forChild(routes),MaterialModule,SharedModule
  ],
  exports:[RouterModule]
})
export class SettingsModule { }
