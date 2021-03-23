import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
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
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  
  myControl = new FormControl();
  searchOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  minValue: number = 100;
  highValue: number = 300;
  sliderOptions: Options = {
    floor: 0,
    ceil: 1000
  }

  active: number = 1
  contactActive: number = 0

  selectedContact: string[] = ['One', 'Two', 'Three']

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

  public onSelectionChange(e) {
    const searchKey = e.option.value
    this.selectedContact = this.searchOptions.filter(v => v == searchKey)
    console.log(this.selectedContact)
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

  //contact 
  public clickUser() {
    this.contactActive = 0
    this.active = 1
    this.searchOptions = ['One', 'Two', 'Three']
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
    this.selectedContact = ['One', 'Two', 'Three']
  }

  public clickCompany() {
    this.contactActive = 1
    this.active = 2
    this.searchOptions = ['Four', 'Five', 'Six']
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
    this.selectedContact = ['Four', 'Five', 'Six']
  }

  public clearClick() {
    this.checkboxes.forEach((element) => {
      element.checked = false;
    })
  }
}
