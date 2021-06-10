import { Component, OnInit, Inject, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventMountArg } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppointDialog, Appointment } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog, NTask } from '../detail/task-dialog/task-dialog';
import { INITIAL_TASKS, createEventId } from './event-utils';
import * as moment from 'moment';

export interface Reminder {
  count: number,
  title: string,
  date: moment.Moment,
  time: string,
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
    initialView: 'timeGridWeek',
    //initialEvents: INITIAL_EVENTS,
    firstDay: 1,
    weekends: true,
    dayMaxEvents: 4,
    allDaySlot: false,
    slotDuration: '01:00:00',
    fixedWeekCount: false,
    aspectRatio: 2.0,
    //editable: true,
    //selectable: true,
    //selectMirror: true,
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventContent: this.handleEventContent.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
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

    const appoint: Appointment = {
      id: undefined,
      title: 'New android phone presentation',
      where: '',
      description: '',
      start_date: moment('2021-06-10'),
      start_time: '09:00 AM',
      end_date: moment('2021-06-12'),
      end_time: '11:00 AM',
      contact: '',
      reminder_date: undefined,
      reminder_time: undefined,
    };
    this.addAppointmentEvent(appoint)
  }

  testWeekDay(date: moment.Moment) {
    let weekNumber = date.week() - moment(date).startOf('month').week();
    
    let dayOfWeek = date.clone().startOf('month').day()
    if (dayOfWeek != 0 && dayOfWeek <= 4) {
        weekNumber += 1
    }

    dayOfWeek = date.clone().add(1, 'month').startOf('month').day()
    // let prevMonth = 1, nextMonth = 0
    // for (let i = 1; i < 7; i++) {
    //   const next = date.add(i, 'day')
    //   date.month() == next.month() ? prevMonth ++ : nextMonth ++
    // }

    // let weekNumber = date.week() - moment(date).startOf('month').week();
    // if (nextMonth > 0 && prevMonth > nextMonth) {
    //   weekNumber -= 1
    // }
    // const monthDay = (prevMonth > nextMonth) ? date : date.add(6, 'day')
  }

  updateTitle() {
    let calendarApi = this.calendarComponent.getApi();
    if (calendarApi.view.type === 'dayGridMonth') {
      this.title = calendarApi.getCurrentData().viewTitle
    }
    else {
      console.log(calendarApi.getCurrentData())
      const date = moment(calendarApi.getDate())
      this.testWeekDay(date)
      //const weekNumber = date.week() - moment(date).startOf('month').week() + 1;
      this.title = calendarApi.getCurrentData().viewTitle
    }
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

  private getEventDate(day: moment.Moment, time: string) {
    const date = day ? moment(day) : moment()
    if (time) {
      var tm = moment(time, ["h:mm A"])
      date.add(tm.hours(), 'hours').add(tm.minutes(), 'minutes') 
    }
    return date.toDate() //date.format('YYYY-MM-DD HH:mm:ss')
  }

  private addAppointmentEvent(appoint: Appointment) {
    console.log('addAppointmentEvent:', appoint);
    const calendarApi = this.calendarComponent.getApi()
    calendarApi.unselect();

    if (appoint.id) {
      const event = calendarApi.getEventById(appoint.id)
      event.setProp('title', appoint.title)
      event.setStart(appoint.start_date.format('YYYY-MM-DD'))
      event.setEnd(appoint.end_date.format('YYYY-MM-DD'))
      event.setExtendedProp('appointment', appoint)
    }
    else {
      const eventId = createEventId()
      appoint.id = eventId

      let startTime = this.getEventDate(appoint.start_date, appoint.start_time)
      let endTime = this.getEventDate(appoint.end_date, appoint.end_time)
      if (calendarApi.view.type === 'timeGridWeek') {
        endTime = moment(startTime).add(1, 'minute').toDate()
      }
      
      calendarApi.addEvent({
        id: eventId,
        title: appoint.title,
        start: startTime,
        end: endTime,
        extendedProps: {
          'appointment': appoint 
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
    //console.log('addTaskEvent:', task);
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

      const className = task.due_date <= moment() ? 'event-overdue' : 'event-future'
      calendarApi.addEvent({
        id: eventId,
        title: task.title,
        date: this.getEventDate(task.due_date, task.due_time),
        extendedProps: {
          'task': task 
        },
        className: [className]
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
    if (arg.event.extendedProps.reminder) {
      const reminder: Reminder = arg.event.extendedProps.reminder;
      this.reminderTitle = reminder.date.format('MMM DD dddd');
      this.reminderEvents = reminder.events;

      const reminderButton: HTMLElement = document.getElementById('reminderButton');
      this.renderer.setStyle(reminderButton, 'left', `${arg.jsEvent.x}px`);
      this.renderer.setStyle(reminderButton, 'top', `${arg.jsEvent.pageY - 46}px`);
      reminderButton.click();
      return
    }

    if (arg.event.extendedProps.task) {
      const target = arg.jsEvent.target;
      if (target['tagName'] === 'INPUT' || target['className'] === 'event-checkmark') {
        console.log('checkbox is clicked');
        return;
      }
    }
    
    this.eventClicked(arg.event)
  }

  eventClicked(event) {
    if (!this.dialogOpened) {
      this.dialogOpened = true;

      const props = event.extendedProps
      props.task && this.openTaskDialog(true, props.task)
      props.appointment && this.openAppointDialog(true, props.appointment)
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    //console.log('currentEvents', this.currentEvents)
  }

  handleEventContent(arg) {
    const divEl = document.createElement('label')
    divEl.className = 'event-content'

    if (arg.event.extendedProps.task) {
      const task: NTask = arg.event.extendedProps.task
      const inputClass = task.due_date < moment() ? 'overdue' : 'upcoming'
      divEl.innerHTML = `<input type='checkbox' class='${inputClass}'><span class='event-checkmark'></span>`
      const div2 = document.createElement('label')
      div2.className = 'event-content'
      div2.innerHTML = `<span>${task.due_time??''} ${arg.event.title}</span>`
      return { domNodes: [ divEl, div2 ] }
    }
    
    if (arg.event.extendedProps.reminder) {
      divEl.innerHTML = `<mat-icon role='img' class='mat-icon notranslate material-icons mat-icon-no-color reminder-icon' aria-hidden='true' data-mat-icon-type='font'>notifications</mat-icon><span class='event-checkmark'>${arg.event.title}</span>`
    }
    else if (arg.event.extendedProps.appointment) {
      divEl.innerHTML = `<span class='event-checkmark'>${arg.event.title}</span>`
    }
    
    return { domNodes: [ divEl ] }
  }

  handleEventDidMount(arg: EventMountArg) {
    if (arg.view.type == 'timeGridWeek') {
      const parentNode = arg.el.parentNode as HTMLElement
      const values = parentNode.style['inset'].split(' ')

      const props = arg.event.extendedProps
      if (props.appointment) {
        const appoint: Appointment = props.appointment
        if (appoint.start_date && appoint.end_date) {
          const delta = appoint.end_date.diff(appoint.start_date, 'day')
          console.log('handleEventDidMount, delta=', delta)
          if (delta > 1) {
            values[1] = `${-105 * delta}%`
          }
        }
      }
      
      const insetStyle = `${values[0]} ${values[1]} 0% 0%`
      parentNode.setAttribute('style', `inset: ${insetStyle}; z-index: 1;`)
      console.log('handleEventDidMount, style', arg.event, values, insetStyle)
    }
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
    // First, remove reminders
    [...this.currentEvents].forEach(e => {
      if (e.extendedProps.reminder) {
        e.remove()
      }
    })
    
    const reminders = {}
    const addReminder = function(date: moment.Moment, time: string, event: EventApi) {
      const title = date.format('YYYY-MM-DD')
      if (title in reminders) {
        const reminder: Reminder = reminders[title]
        reminder.count++
        reminder.events.push(event)
      }
      else {
        const reminder: Reminder = {
          count: 1, 
          title: title,
          date: date,
          time: time,
          events: [event]
        }
        reminders[title] = reminder
      }
    }

    const events: EventApi[] = this.currentEvents.filter(e => e.extendedProps.task || e.extendedProps.appointment)
    events.forEach(e => {
      const props = e.extendedProps
      if (props.task && props.task.reminder_date) {
        const task: NTask = props.task
        task.reminder_date && addReminder(task.reminder_date, task.reminder_time, e)
      }
      else if (props.appointment && props.appointment.reminder_date) {
        const appoint: Appointment = props.appointment
        appoint.reminder_date && addReminder(appoint.reminder_date, appoint.reminder_time, e)
      }
    })
    //console.log('reminders', reminders)

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