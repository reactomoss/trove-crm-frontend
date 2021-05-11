import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { AppointDialog, Appointment } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog, NTask } from '../detail/task-dialog/task-dialog';
import { INITIAL_EVENTS, createEventId } from './event-utils';

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
    //initialEvents: INITIAL_EVENTS,
    weekends: true,
    //editable: true,
    //selectable: true,
    //selectMirror: true,
    dayMaxEvents: true,
    firstDay: 1,
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  }
  currentEvents: EventApi[] = [];

  constructor(
    public dialog: MatDialog, 
    private router: Router) {
  }

  ngOnInit(): void {
  }

  openAppointDialog(isEdit: boolean, appointment: Appointment) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit, appointment: appointment }
    });

    dialogRef.afterClosed().subscribe(appointment => {
      console.log(`Dialog sent: ${appointment}`);
      if (appointment) {
        this.addAppointmentEvents(appointment)
      }
    })
  }
  
  openTaskDialog(isEdit: boolean, task: NTask) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit, task: task }
    });

    dialogRef.afterClosed().subscribe(task => {
      console.log(`Dialog sent: ${task}`);
      if (task) {
        this.addTaskEvents(task)
      }
    })
  }

  private addAppointmentEvents(appointment: Appointment) {
    console.log('updateCalendarAppointmentEvents:', appointment);
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

  private addTaskEvents(task: NTask) {
    console.log('updateCalendarTaskEvents:', task);
    const calendarApi = this.calendarComponent.getApi()
    calendarApi.unselect();

    if (task.id) {
      const event = calendarApi.getEventById(task.id)
      event.setProp('title', task.title)
      event.setProp('date', task.due_date.format('YYYY-MM-DD'))
      event.setExtendedProp('task', task)
    }
    else {
      const eventId = createEventId()
      task.id = eventId
        
      calendarApi.addEvent({
        id: eventId,
        title: task.title,
        date: task.due_date.format('YYYY-MM-DD'),
        extendedProps: {
          'type': 'task',
          'task': task 
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
      const task = clickInfo.event.extendedProps['task'];
      this.openTaskDialog(true, task)
    }
    /*if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
       clickInfo.event.remove();
    }*/
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    console.log('currentEvents', this.currentEvents)
  }
}