import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})

  
export class LeadsComponent implements OnInit {
  listShow: boolean = false
  panelOpenState = false

  constructor() { }

  ngOnInit(): void {
    
  }

  showList() {
    this.listShow = true
  }

  showCards() {
    this.listShow = false
  }
}
