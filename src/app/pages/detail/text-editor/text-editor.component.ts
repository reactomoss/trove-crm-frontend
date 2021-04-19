import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
      name: "Person",  icon: "person", isChecked: false
    },
    {
      name: "Person 2",  icon: "person", isChecked: false
    },
    {
      name: "Person 3",  icon: "person" , isChecked: false
    }
    ]
    optionsCompany: any[] = [
      {
        name: "Company",  icon: "business" , isChecked: false
      },
      {
        name: "Company 2",  icon: "business" , isChecked: false
      },
      {
        name: "Company 3",  icon: "business" , isChecked: false
      }
      ]
      optionsLeads: any[] = [
        {
          name: "Leads",  icon: "leaderboard" , isChecked: false
        },
        {
          name: "Leads 2",  icon: "leaderboard" , isChecked: false
        },
        {
          name: "Leads 3",  icon: "leaderboard" , isChecked: false
        }
        ]

  selected: any[] = []
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
