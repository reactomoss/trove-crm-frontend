import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppointDialog, Appointment } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog, NTask } from '../detail/task-dialog/task-dialog';
import { INITIAL_TASKS, createEventId } from './event-utils';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    plugins: [ timeGridPlugin ],
    customButtons: {
      scheduleAppointment: {
        text: 'Schedule an appointment',
        click: () => this.openAppointDialog(false, null)
      },
      scheduleTask: {
        text: 'Schedule a task',
        click: () => this.openTaskDialog(false, null)
      }
    },
    headerToolbar: {
        left: '',
        center:'',
        right: '',
    },
    initialView: 'dayGridMonth',
    //initialEvents: INITIAL_EVENTS,
    weekends: true,
    dayMaxEvents: 2,
    //editable: true,
    //selectable: true,
    //selectMirror: true,
    firstDay: 1,
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventContent: this.handleEventContent.bind(this),
  }
  events = []
  currentEvents: EventApi[] = [];
  title = ''
  filters = {
      all: true,
      task: true,
      appoint: true,
      reminder: true
  }

  constructor(
    public dialog: MatDialog, 
    private router: Router) {
  }

  ngOnInit(): void {    
  }

  ngAfterViewInit(): void {
    const calendarApi = this.calendarComponent.getApi();
    INITIAL_TASKS.forEach(task => {
        console.log(task)
        this.addTaskEvent(task)
    })
    this.updateTitle()
  }

  updateTitle() {
    let calendarApi = this.calendarComponent.getApi();
    this.title = calendarApi.getCurrentData().viewTitle
  }

  openAppointDialog(isEdit: boolean, appointment: Appointment) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit, appointment: appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      if (result) {
        if (result.action == 'delete') {
            this.deleteAppointment(result.appointment)
        }
        else {
            this.addAppointmentEvent(result.appointment)
        }
      }
    })
  }
  
  openTaskDialog(isEdit: boolean, task: NTask) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit, task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      if (result) {
        if (result.action == 'delete') {
            this.deleteTask(result.task)
        }
        else {
            this.addTaskEvent(result.task)
        }
      }
    })
  }

  private addAppointmentEvent(appointment: Appointment) {
    console.log('addAppointmentEvent:', appointment);
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
          'isTask': false,
          'appointment': appointment 
        },
        color: '#e9effb',
        textColor: '#315186'
      })
    }
  }

  private deleteAppointment(appointment: Appointment) {
    if (appointment.id) {
      const calendarApi = this.calendarComponent.getApi()
      const event = calendarApi.getEventById(appointment.id)
      event.remove()
    }
  }

  private addTaskEvent(task: NTask) {
    console.log('addTaskEvent:', task);
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

      let color = 'rgb(255, 214, 193)'
      let textColor = 'rgb(230, 74, 0)'
      if (task.due_date > moment()) {
        color = '#f9e8ec'
        textColor = '#d5617a'
      }

      calendarApi.addEvent({
        id: eventId,
        title: task.title,
        date: task.due_date.format('YYYY-MM-DD'),
        extendedProps: {
          'isTask': true,
          'task': task 
        },
        color: color,
        textColor: textColor
      })
    }
  }

  private deleteTask(task: NTask) {
    if (task.id) {
      const calendarApi = this.calendarComponent.getApi()
      const event = calendarApi.getEventById(task.id)
      event.remove()
    }
  }

  prev() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
    this.updateTitle();
  }

  next() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    this.updateTitle();
  }

  weekView() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView('timeGridWeek');
  }

  monthView() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView('dayGridMonth');
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
    
    if (clickInfo.event.extendedProps.isTask) {
      const task = clickInfo.event.extendedProps['task'];
      this.openTaskDialog(true, task)
    }
    else {
      const appointment = clickInfo.event.extendedProps['appointment'];
      this.openAppointDialog(true, appointment)
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    //console.log('currentEvents', this.currentEvents)
  }

  handleEventContent(arg) {
    let divEl = document.createElement('div')
    divEl.className = 'checkbox-inline'

    //console.log('handleEventContent', arg.event.extendedProps)
    if (arg.event.extendedProps.isTask) {
        const task = arg.event.extendedProps.task
        divEl.innerHTML = `<input type='checkbox' class='event-checkbox'>${task.due_time??''} ${arg.event.title}`
    } else {
        divEl.innerHTML = arg.event.title
    }
    
    let arrayOfDomNodes = [ divEl ]
    return { domNodes: arrayOfDomNodes }
  }

  showAllEvents() {
    if (this.filters.all) {
      this.filters.task = this.filters.appoint = this.filters.reminder = true  
    }
    this.filterEvents()
  }

  updateFilter() {
    this.filters.all = (this.filters.task && this.filters.appoint && this.filters.reminder)
    this.filterEvents()
  }

  private filterEvents() {
    this.currentEvents.forEach(event => {
      if (event.extendedProps.isTask) {
        event.setProp('display', (this.filters.all || this.filters.task) ? 'auto' : 'none')
      }
      else {
        event.setProp('display', (this.filters.all || this.filters.appoint) ? 'auto' : 'none')
      }
    })
  }
}