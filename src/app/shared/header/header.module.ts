import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { DemoMaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
  ],
  exports: []

})
export class HeaderModule { }
