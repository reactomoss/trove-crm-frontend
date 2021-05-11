import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { AppointDialog, Appointment } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog } from '../detail/detail.component';
import { INITIAL_EVENTS, createEventId } from './event-utils';

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
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    firstDay: 1,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  }
  currentEvents: EventApi[] = [];

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
  
  openTaskDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      if (result) {
        
      }
    })
  }

  openAppointDialog(isEdit: boolean, appointment: Appointment) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit, appointment: appointment}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      if (result) {
        this.updateCalendarEvents(result)
      }
    })
  }

  private updateCalendarEvents(appointment: Appointment) {
    console.log('updateCalendarEvents:', appointment);
    const calendarApi = this.calendarComponent.getApi()
    calendarApi.unselect();

    if (appointment.id) {
      const event = calendarApi.getEventById(appointment.id)
      event.setProp('title', appointment.title)
      event.setStart(appointment.start_date.format('YYYY-MM-DD'))
      event.setEnd(appointment.end_date.format('YYYY-MM-DD'))
      event.setExtendedProp('appointment', appointment)
    }
    else {
      const eventId = createEventId()
      appointment.id = eventId
        
      calendarApi.addEvent({
        id: eventId,
        title: appointment.title,
        start: appointment.start_date.format('YYYY-MM-DD'),
        end: appointment.end_date.format('YYYY-MM-DD'),
        extendedProps: {
          'type': 'appointment',
          'appointment': appointment 
        }
      })
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event, clickInfo.event.extendedProps)
    
    const extendedProps = clickInfo.event.extendedProps
    const type = extendedProps["type"]
    if (type == 'appointment') {
      const appointment = clickInfo.event.extendedProps['appointment'];
      this.openAppointDialog(true, appointment)
    }
    else if (type == 'task') {
      this.openTaskDialog(true)
    }
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    console.log('currentEvents', this.currentEvents)
  }
}