import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,MatButtonModule,
    MatFormFieldModule,MatInputModule,MatIconModule,MatMenuModule,
    MatTabsModule,MatTableModule,MatPaginatorModule,MatSortModule,
    MatCheckboxModule,MatSelectModule,DragDropModule,MatSnackBarModule,
    MatSidenavModule,MatGridListModule,MatCardModule,MatExpansionModule,
    FlexLayoutModule,MatSlideToggleModule,MatProgressSpinnerModule
  ],
  exports: [
    CommonModule,FormsModule,ReactiveFormsModule,MatButtonModule,
    MatFormFieldModule,MatInputModule,MatIconModule,MatMenuModule,
    MatTabsModule,MatTableModule,MatPaginatorModule,MatSortModule,
    MatCheckboxModule,MatSelectModule,DragDropModule,MatSnackBarModule,
    MatSidenavModule,MatGridListModule,MatCardModule,MatExpansionModule,
    FlexLayoutModule,MatSlideToggleModule,MatProgressSpinnerModule
  ]
})
export class MaterialModule { }
