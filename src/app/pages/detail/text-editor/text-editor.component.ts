import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})

export class TextEditorComponent implements AfterViewInit {
  @ViewChild('tabGroup', { static: false })
  public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;
  public editorShow: boolean = true;

  public titleOptions1: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }


  public titleOptions2: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions3: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
    console.log('tabIndex', this.activeTabIndex)
  }


  // input data for company,leads,contacts
  optionsPerson: any[] = [
    {
      name: "Person",
      icon: "person",
      isChecked: false,
      email: "sampleperson@gmail.com"
    },
    {
      name: "Person 2",
      icon: "person",
      isChecked: false,
      email: "sampleperson2@gmail.com"
    },
    {
      name: "Person 3",
      icon: "person",
      isChecked: false,
      email: "sampleperson3@gmail.com"
    }
    ]
    optionsCompany: any[] = [
      {
        name: "Company",  icon: "business" , isChecked: false,
        desc: "Sample Description"
      },
      {
        name: "Company 2",  icon: "business" , isChecked: false,
        desc: "Sample Description2"
      },
      {
        name: "Company 3",  icon: "business" , isChecked: false,
        desc: "Sample Description3"
      }
      ]
      optionsLeads: any[] = [
        {
          name: "Leads",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description"
        },
        {
          name: "Leads 2",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description2"
        },
        {
          name: "Leads 3",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description3"
        }
        ]

  selected: any[] = []
  // input data for company,leads,contacts

  // input data for company,leads,contacts
  optionsPersonEmail: any[] = [
    {
      name: "Person",
      icon: "person",
      isChecked: false,
      email: "sampleperson@gmail.com"
    },
    {
      name: "Person 2",
      icon: "person",
      isChecked: false,
      email: "sampleperson2@gmail.com"
    },
    {
      name: "Person 3",
      icon: "person",
      isChecked: false,
      email: "sampleperson3@gmail.com"
    }
    ]
    optionsCompanyEmail: any[] = [
      {
        name: "Company",  icon: "business" , isChecked: false,
        desc: "Sample Description"
      },
      {
        name: "Company 2",  icon: "business" , isChecked: false,
        desc: "Sample Description2"
      },
      {
        name: "Company 3",  icon: "business" , isChecked: false,
        desc: "Sample Description3"
      }
      ]
      optionsLeadsEmail: any[] = [
        {
          name: "Leads",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description"
        },
        {
          name: "Leads 2",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description2"
        },
        {
          name: "Leads 3",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description3"
        }
        ]

  selectedEmail: any[] = []
  // input data for company,leads,contacts

  // input data for company,leads,contacts
  optionsPersonCall: any[] = [
    {
      name: "Person",
      icon: "person",
      isChecked: false,
      email: "sampleperson@gmail.com"
    },
    {
      name: "Person 2",
      icon: "person",
      isChecked: false,
      email: "sampleperson2@gmail.com"
    },
    {
      name: "Person 3",
      icon: "person",
      isChecked: false,
      email: "sampleperson3@gmail.com"
    }
    ]
    optionsCompanyCall: any[] = [
      {
        name: "Company",  icon: "business" , isChecked: false,
        desc: "Sample Description"
      },
      {
        name: "Company 2",  icon: "business" , isChecked: false,
        desc: "Sample Description2"
      },
      {
        name: "Company 3",  icon: "business" , isChecked: false,
        desc: "Sample Description3"
      }
      ]
      optionsLeadsCall: any[] = [
        {
          name: "Leads",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description"
        },
        {
          name: "Leads 2",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description2"
        },
        {
          name: "Leads 3",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description3"
        }
        ]

  selectedCall: any[] = []
  // input data for company,leads,contacts

  constructor() {
    this.activeTabIndex = 0;
  }

  // input data for company,leads,contacts
  public onSelectionChange(event) {
    if(event.isChecked) {
      this.selected.push(event);
    }
    else{
      this.deleteSelected(event);
    }
  }

  deleteSelected(e) {
    e.isChecked = false;
    const index = this.selected.indexOf(e)
    this.selected.splice(index, 1)
  }
  // input data for company,leads,contacts

   // input data for company,leads,contacts
   public onSelectionChangeEmail(event) {
    if(event.isChecked) {
      this.selectedEmail.push(event);
    }
    else{
      this.deleteSelectedEmail(event);
    }
  }

  deleteSelectedEmail(e) {
    e.isChecked = false;
    const index = this.selectedEmail.indexOf(e)
    this.selectedEmail.splice(index, 1)
  }
  // input data for company,leads,contacts

  // input data for company,leads,contacts
  public onSelectionChangeCall(event) {
    if(event.isChecked) {
      this.selectedCall.push(event);
    }
    else{
      this.deleteSelectedCall(event);
    }
  }

  deleteSelectedCall(e) {
    e.isChecked = false;
    const index = this.selectedCall.indexOf(e)
    this.selectedCall.splice(index, 1)
  }
  // input data for company,leads,contacts

  ngAfterViewInit(): void {
    this.activeTabIndex = this.tabGroup.selectedIndex;
  }

  public showEditor() {
    this.editorShow = true
  }

  public hideEditor() {
    this.editorShow = false
  }
}
