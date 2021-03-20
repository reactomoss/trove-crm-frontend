import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  @Output() addTaskClicked = new EventEmitter()
  @Output() addAppointClicked = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  addAppoint() {
    console.log('add appoint')
    this.addAppointClicked.emit()
  }

  addTask() {
    console.log('add task')
    this.addTaskClicked.emit()
  }
}
