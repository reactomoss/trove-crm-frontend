import { Component, OnInit, EventEmitter, Output } from '@angular/core';

export class Task {
  constructor(public name: string, public icon: string , public color: string, public desc: string,  public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}

export class Appointment {
  constructor(public name: string, public icon: string , public color: string, public desc: string,  public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}

export class File {
  constructor(public name: string, public type: string, public description: string) {
  }
}

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter()
  @Output() addAppointClicked = new EventEmitter()
  tasks: Task[] = [
    new Task("Packet Monster Sales opportunity", "notification", "default", "Today at 9:00"),
    new Task("Ux design meeting at 17:30hrs.", "calendar", "red", "Sat, 21 Apr, 2021"),
    new Task("Landing page required for new CRM app", "notification", "default", "Sun, 22 Apr, 2021"),
    new Task("Meeting required for new CRM app", "calendar", "default", "Mon, 23 Apr, 2021"),
  ]

  appointments: Appointment[] = [
    new Appointment("Packet Monster Sales opportunity", "notification", "default", "Today at 9:00"),
    new Appointment("Appointment meeting at 17:30hrs.", "calendar", "red", "Sat, 21 Apr, 2021"),
    new Appointment("Landing page required for new CRM app", "notification", "default", "Sun, 22 Apr, 2021"),
    new Appointment("UX required for new CRM app", "calendar", "default", "Mon, 23 Apr, 2021"),
  ]

  files: File[] = [
    new File("Sales guide to file.docx", "word", "57.35KB, 2021/01/16  14:05"),
    new File("Weekly sales reort(Jan 1-7).xls", "excel", "5 Bytes, 2021/01/16  14:05"),
    new File("FIle export-status.pdf", "pdf", "3.9 MB, 2021/01/16  14:05"),
    new File("Sales guide to file1.docx", "word", "57.35KB, 2021/02/1  14:05"),
    new File("Sales guide to file2.docx", "pdf", "57.35KB, 2021/02/2  15:05"),
    new File("Sales guide to file3.docx", "excel", "57.35KB, 2021/02/3  16:05"),
    new File("Sales guide to file4.docx", "word", "57.35KB, 2021/02/4  17:05")
  ]

  constructor() { }

  ngOnInit(): void {
  }

  addAppoint() {
    console.log('add appoint')
    this.addAppointClicked.emit(false)
  }

  editAppoint() {
    console.log('Edit appoint')
    this.addAppointClicked.emit(true)
  }

  addTask() {
    console.log('add task')
    this.addTaskClicked.emit(false)
  }
  editTask() {
    console.log('add task')
    this.addTaskClicked.emit(true)
  }
}
