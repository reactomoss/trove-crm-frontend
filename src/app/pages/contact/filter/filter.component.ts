import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'contact-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class ContactFilterComponent implements OnInit {

  status: string
  statusTypes: string[] = ['All', 'Active', 'Inactive']

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number

  constructor() { }

  ngOnInit(): void {
  }

}
