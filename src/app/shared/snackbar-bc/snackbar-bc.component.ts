import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-bc',
  templateUrl: './snackbar-bc.component.html',
  styleUrls: ['./snackbar-bc.component.css']
})
export class SnackbarBCComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar() {
    this._snackBar.open('Cannonball!!', 'End now', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngOnInit(): void {

  }

}
