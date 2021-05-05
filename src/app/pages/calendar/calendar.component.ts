import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

export interface item {
  id: number;
  name: string;
  owner: string;
  contactCount: number;
  email: string;
  companyName: string;
  company: boolean;
  last: Date;
  city: string;
}

export interface selectedData {
  items: item[]
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  filterCount: number = 0
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  hoveredItem
  //detect for click card, check
  detect: number

  allItems: item[] = [

    {
      id: 2,
      name: 'Bryce Dallas Howard',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Dona factory',
      email: 'example@gmail.com',
      last: new Date("2020-12-15"),
      city: 'Fort Worth'
    },
    {
      id: 3,
      name: 'Berry Watson',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-12-14"),
      city: 'San Francisco'
    },
    {
      id: 4,
      name: 'Berry Watson',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-12-13"),
      city: 'Los Angeles'
    },
    {
      id: 5,
      name: 'Edward James Olmos',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-12-12"),
      city: 'San Antonio'
    },
    {
      id: 7,
      name: 'Tammy Gillis',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-11-7"),
      city: 'Paris'
    },
    {
      id: 8,
      name: 'Bryce Dallas Howard',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Dona factory',
      email: 'example@gmail.com',
      last: new Date("2020-11-6"),
      city: 'Madrid'
    },
    {
      id: 10,
      name: 'Wes Studi',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-11-4"),
      city: 'Oklahoma City'
    },
    {
      id: 12,
      name: 'Berry Watson',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-11-1"),
      city: 'Chicago'
    },
  ]
  items: item[] = []
  selectedItems: item[] = []

  listShow: boolean = false
  typeString: string = 'Contact'

  constructor(public dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.items = this.allItems
  }

  showList() {
    this.listShow = true
    this.selectedItems = []
  }

  showGrid() {
    this.listShow = false
    this.selectedItems = []
  }

  selectContact() {
    this.items = this.allItems.filter(e => !e.company)
    this.typeString = 'Contact'
    this.selectedItems = []
  }

  selectCompany() {
    this.items = this.allItems.filter(e => e.company)
    this.typeString = 'Company'
    this.selectedItems = []
  }

  clickCard(item) {
    this.router.navigate(['/pages/contact_detail'])
  }

  clickCompanyPage() {
    this.router.navigate(['/pages/company'])
  }

  clickCheck(e, item) {
    this.detect = 1
    e.preventDefault()
    const index = this.selectedItems.indexOf(item, 0)
    if (index > -1) {
      this.selectedItems.splice(index, 1)
    } else {
      this.selectedItems.push(item)
    }
  }

  setCheckStatus(item) {
    const index = this.selectedItems.indexOf(item, 0)
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  showCardCheckBox(item) {
    const index = this.selectedItems.indexOf(item, 0);
    if (this.hoveredItem == item || index > -1)
      return true
    return false
  }

  setHoveredItem(item) {
    this.hoveredItem = item
  }

  clickEmptyCheck() {
    this.selectedItems = this.items.reduce((acc, item) => {
      acc.push(item)
      return acc
    }, [])
  }

  clickIndeterminate() {
    this.selectedItems = []
  }

  clickEmail() {
    
  }
  filterCountChangedHandler(e) {
    this.filterCount = e
  }

}