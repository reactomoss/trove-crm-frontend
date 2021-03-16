import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isNotification:boolean = false
  menus: any[];
  constructor() { }

  ngOnInit(): void {
   this.menus=[
      {
        icon:'menu001.png',
        link:'/pages/dashboard'
      },
      {
        icon:'menu006.png',
        link:'/pages/contact'
      },
      {
        icon:'menu002.png',
        link:'/pages/lead'
      },
      {
        icon:'menu003.png',
        link:'/pages/email'
      },
      {
        icon:'menu004.png',
        link:'/pages/calendar'
      },
      {
        icon:'menu005.png',
        link:'/pages/pipeline'
      }
    ]
  }
   showNotification(){
     this.isNotification = !this.isNotification
   }
}
