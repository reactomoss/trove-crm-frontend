import { Component, OnInit } from '@angular/core';

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

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  allItems: item[] = [
    {
      id: 1,
      name: 'Alphabet Inc.',
      owner: 'Henessy',
      contactCount: 9,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2021-1-1"),
      city: 'boston'
    },
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
      id: 6,
      name: 'Packet Monster',
      owner: 'Wes studi',
      contactCount: 37,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2020-11-30"),
      city: 'London'
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
      id: 9,
      name: 'Packet Monster3',
      owner: 'Wes studi',
      contactCount: 3,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2020-11-5"),
      city: 'Barcelona'
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
      id: 11,
      name: 'Packet Monster1',
      owner: 'Wes studi',
      contactCount: 2,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2020-11-3"),
      city: 'Utah'
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

  constructor() {
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
    const index = this.selectedItems.indexOf(item, 0);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item)
    }
    console.log(this.selectedItems)
  }

  clickCheck(e) {
    e.preventDefault()
  }

  setCheckStatus(item) {
    const index = this.selectedItems.indexOf(item, 0);
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  clickIndeterminate() {
    this.selectedItems = []
  }

  clickEmail() {
    console.log(this.selectedItems)
  }

}
