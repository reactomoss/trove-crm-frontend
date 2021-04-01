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
  public editorShow: boolean = false;

  public titleOptions1: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    
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
  
  public titleOptions3: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
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

  constructor() {
    this.activeTabIndex = 0
  }

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
