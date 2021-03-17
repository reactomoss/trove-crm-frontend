import { Component, OnInit, ViewChild } from '@angular/core';
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

}
