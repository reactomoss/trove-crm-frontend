import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';
import { AppointDialog, TaskDialog } from '../detail/detail.component';

export class Task {
  constructor(public name: string, public icon: string , public color: string, public desc: string,  public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  filterCount: number = 0
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    dayMaxEvents: true, // allow "more" link when too many events
    firstDay: 1,
    events: [
      { title: 'Packet Monster Sales opportunity', start: '2021-05-07', end: '2021-05-10', 'groupId': 'appointment'},
      { title: 'Ux design meeting at 17:30hrs.', date: '2021-05-08', 'groupId': 'task'},
    ],
    eventClick: (info) => {
      info.jsEvent.preventDefault(); // don't let the browser navigate
      console.log(info.event.groupId)
      if (info.event.groupId == 'appointment') {
        this.openAppointDialog(true)
      }
      else if (info.event.groupId == 'task') {
        this.openTaskDialog(true)
      }
    }
  }

  tasks: Task[] = [
    new Task("Packet Monster Sales opportunity", "notification", "default", "Today at 9:00"),
    new Task("Ux design meeting at 17:30hrs.", "calendar", "red", "Sat, 21 Apr, 2021"),
    new Task("Landing page required for new CRM app", "notification", "default", "Sun, 22 Apr, 2021"),
    new Task("Meeting required for new CRM app", "calendar", "default", "Mon, 23 Apr, 2021"),
  ]

  constructor(
    public dialog: MatDialog, 
    private router: Router) {
  }

  ngOnInit(): void {
  }
  
  filterCountChangedHandler(e) {
    this.filterCount = e
  }

  openTaskDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

  openAppointDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
    })
  }
}