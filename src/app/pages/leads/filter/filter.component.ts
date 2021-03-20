import { Component, OnInit } from '@angular/core';
import { Options } from "@angular-slider/ngx-slider";
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  myControl = new FormControl();
  searchOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  minValue: number = 100;
  highValue: number = 300;
  options: Options = {
    floor: 0,
    ceil: 1000
  };

  active: number = 1

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
    
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public onSelectionChange(event) {
    console.log('selection', event.option.value)
  }

  public setActive(num) {
    console.log('set active', num)
    this.active = num
    if (num == 1) {
      this.searchOptions = ['One', 'Two', 'Three']
    } else if (num == 2) {
      this.searchOptions = ['Four', 'Five', 'Six']
    } else if (num == 3) {
      this.searchOptions = ['Seven', 'Eight', 'Nine']
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }

  public activeClass(num) {
      if (num == this.active)
        return 'activeBtn'
      else
        return ''
    }
}
