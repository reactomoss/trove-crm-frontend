import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})

export class TextEditorComponent implements OnInit {
  //@ViewChild('tabGroup', { static: false })
  @Input() activity: any
  @Input() associate_members
  public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;
  public editorShow: boolean = true;

  private noteDescription
  
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

  selectedAssociates: any[] = []
  selectedEmail: any[] = []
  selectedCall: any[] = []

  constructor() {
    this.activeTabIndex = 0;
    this.associate_members = {
      contacts: [],
      organizations: [],
      leads: []
    }
  }

  ngOnInit(): void {
    console.log('text-editor', this.activity)
  }

  ngOnChanges(): void {
    console.log('text-editor-ngOnChanges', this.activity, this.associate_members)
    if (this.activity) {
      if (this.activity.activity_name === 'note') this.activeTabIndex = 0;
      else if (this.activity.activity_name === 'email') this.activeTabIndex = 1;
      else if (this.activity.activity_name === 'call') this.activeTabIndex = 2;
    }
  }

  public onSelectionChange(event, item) {
    if (event.checked) {
      this.selectedAssociates.push(item);
    }
    else{
      this.deleteSelected(item);
    }
  }

  deleteSelected(item) {
    const index = this.selectedAssociates.indexOf(item)
    this.selectedAssociates.splice(index, 1)
  }

  // ngAfterViewInit(): void {
  //   this.activeTabIndex = this.tabGroup.selectedIndex;
  // }

  public showEditor() {
    this.editorShow = true
  }

  public hideEditor() {
    //this.editorShow = false
  }

  public saveActivity() {
    console.log('saveActivity')
    if (this.selectedAssociates.length <= 0) {
      return
    }
    

  }
}
