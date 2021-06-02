import { Component, OnInit, Inject, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppointDialog, Appointment } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog, NTask } from '../detail/task-dialog/task-dialog';
import { INITIAL_TASKS, createEventId } from './event-utils';
import * as moment from 'moment';

export interface Reminder {
  count: number,
  date: moment.Moment,
  events: EventApi[]
}

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
    dayMaxEvents: 4,
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
  title = moment().format('MMM YYYY')
  filters = {
      all: true,
      task: true,
      appoint: true,
      reminder: true
  }
  dialogOpened = false;
  reminderTitle = ''
  reminderEvents = []

  constructor(
    public dialog: MatDialog, 
    private renderer: Renderer2,
    private router: Router) {
  }

  ngOnInit(): void {    
  }

  ngAfterViewInit(): void {
    INITIAL_TASKS.forEach(task => {
      this.addTaskEvent(task)
    })
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
      this.dialogOpened = false
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
      this.dialogOpened = false
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
          'appointment': appointment 
        },
        color: '#e9effb',
        textColor: '#315186'
      })
    }
    this.updateReminders()
  }

  private deleteAppointment(appointment: Appointment) {
    if (appointment.id) {
      const calendarApi = this.calendarComponent.getApi()
      const event = calendarApi.getEventById(appointment.id)
      event.remove()
    }
    this.updateReminders()
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

      let color = '#f9e8ec'
      let textColor = '#d5617a'
      if (task.due_date > moment()) {
        color = 'rgb(255,214,193)'
        textColor = 'rgb(80,80,80)'
      }

      calendarApi.addEvent({
        id: eventId,
        title: task.title,
        date: task.due_date.format('YYYY-MM-DD'),
        extendedProps: {
          'task': task 
        },
        color: color,
        textColor: textColor
      })
    }
    this.updateReminders()
  }

  private deleteTask(task: NTask) {
    if (task.id) {
      const calendarApi = this.calendarComponent.getApi()
      const event = calendarApi.getEventById(task.id)
      event.remove()
    }
    this.updateReminders()
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

  handleEventClick(arg: EventClickArg) {
    console.log(arg)
    if (arg.event.extendedProps.task) {
      if (this.dialogOpened) return
      this.dialogOpened = true
      const task = arg.event.extendedProps.task
      this.openTaskDialog(true, task)
    }
    else if (arg.event.extendedProps.appointment) {
      if (this.dialogOpened) return
      this.dialogOpened = true
      const appointment = arg.event.extendedProps.appointment
      this.openAppointDialog(true, appointment)
    }
    else if (arg.event.extendedProps.reminder) {
      const reminder: Reminder = arg.event.extendedProps.reminder
      this.reminderTitle = reminder.date.format('MMM DD dddd')
      this.reminderEvents = reminder.events.map(e => {
        if (e.extendedProps.task) {
          return { task: true, title: e.extendedProps.task.title }
        }
        if (e.extendedProps.appointment) {
          return { task: false, title: e.extendedProps.appointment.title }
        }
      })
      console.log(this.reminderEvents)
      const reminderButton: HTMLElement = document.getElementById('reminderButton')
      this.renderer.setStyle(reminderButton, "left", `${arg.jsEvent.x}px`)
      this.renderer.setStyle(reminderButton, "top", `${arg.jsEvent.y-50}px`)      
      reminderButton.click();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    //console.log('currentEvents', this.currentEvents)
  }

  handleEventContent(arg) {
    let divEl = document.createElement('label')
    divEl.className = 'event-content'

    if (arg.event.extendedProps.task) {
      const task: NTask = arg.event.extendedProps.task
      const inputClass = task.due_date < moment() ? 'overdue' : 'upcoming'
      divEl.innerHTML = `<input type='checkbox' class='${inputClass}'><span class='event-checkmark'>${task.due_time??''} ${arg.event.title}</span>`
    }
    else if (arg.event.extendedProps.reminder) {
      const reminder = arg.event.extendedProps.reminder
      divEl.innerHTML = `<mat-icon role='img' class='mat-icon notranslate material-icons mat-icon-no-color reminder-icon' aria-hidden='true' data-mat-icon-type='font'>notifications</mat-icon><span class='event-checkmark'>${arg.event.title}</span>`
    }
    else if (arg.event.extendedProps.appointment) {
      divEl.innerHTML = `<span class='event-checkmark'>${arg.event.title}</span>`
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
    this.currentEvents.forEach(e => {
      if (e.extendedProps.task) {
        e.setProp('display', (this.filters.all || this.filters.task) ? 'auto' : 'none')
      }
      else if (e.extendedProps.appointment) {
        e.setProp('display', (this.filters.all || this.filters.appoint) ? 'auto' : 'none')
      }
      else if (e.extendedProps.reminder) {
        e.setProp('display', (this.filters.all || this.filters.reminder) ? 'auto' : 'none')
      }
    })
  }

  private updateReminders() {
    const temp = [...this.currentEvents]
    temp.forEach(e => {
      if (e.extendedProps.reminder) {
        e.remove()
      }
    })

    const events: EventApi[] = this.currentEvents.filter(e => e.extendedProps.task || e.extendedProps.appointment)
    const reminders = {}
    const addReminder = function(date: moment.Moment, event: EventApi) {
      const key = date.format('YYYY-MM-DD')
      if (key in reminders) {
        const reminder: Reminder = reminders[key]
        reminder.count++
        reminder.events.push(event)
      }
      else {
        reminders[key] = {
          count: 1, date: date, events: [event]
        }
      }
    }
    events.forEach(e => {
      if (e.extendedProps.task) {
        const task: NTask = e.extendedProps.task
        task.remainder_date && addReminder(task.remainder_date, e)
      }
      if (e.extendedProps.appointment) {
        const appoint: Appointment = e.extendedProps.appointment
        appoint.remainder_date && addReminder(appoint.remainder_date, e)
      }
    })

    // Add reminders
    if (Object.keys(reminders).length > 0) {
      const calendarApi = this.calendarComponent.getApi()
      calendarApi.unselect();
      for (const date in reminders) {
        const reminder = reminders[date]
        
        const eventId = createEventId()
        calendarApi.addEvent({
          id: eventId,
          title: `${reminder.count} Reminders`,
          date: date,
          extendedProps: {
            'reminder': reminder 
          },
          color: 'rgb(233,251,236)',
          textColor: '#000'
        })
      }
    }
  }
}