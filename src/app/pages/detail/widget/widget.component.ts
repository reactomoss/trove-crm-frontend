import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as moment from 'moment';
import { DateService } from 'src/app/service/date.service';

export class Task {
  constructor(public name: string, public icon: string , public color: string, public desc: string,  public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}

export class File {
  constructor(public name: string, public url: string, public description: string) {
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
  @Input() leads_value
  @Input() associate_members
  @Input() user_files
  @Input() appointments
  
  
  tasks: Task[] = [
    new Task("Packet Monster Sales opportunity", "notification", "default", "Today at 9:00"),
    new Task("Ux design meeting at 17:30hrs.", "calendar", "red", "Sat, 21 Apr, 2021"),
    new Task("Landing page required for new CRM app", "notification", "default", "Sun, 22 Apr, 2021"),
    new Task("Meeting required for new CRM app", "calendar", "default", "Mon, 23 Apr, 2021"),
  ]

  files: File[] = []

  constructor(
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    console.log('user_files', this.user_files)
    this.files = this.user_files.map(url => {
      const filename = decodeURI(url.substring(url.lastIndexOf('/')+1))
      return new File(filename, url, '')
    })
  }

  getFileIcon(filename: string) {
    const ext = filename.substring(filename.lastIndexOf('.')+1)
    switch (ext) {
      case 'doc': case 'docx':
        return '/assets/images/word-icon.svg';
      case 'xls': case 'xlsx':
        return '/assets/images/excel-icon.svg';
      case 'pdf':
        return '/assets/images/pdf-icon.svg';
      case 'jpg': case 'jpeg':
      case 'png': case 'bmp':
      case 'svg':
        return '/assets/images/pdf-icon.svg';
      default:
        return '/assets/images/pdf-icon.svg';
    }
  }

  downloadFile(file: File) {
    console.log('downloadfile', file)
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', file.url);
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  addAppoint() {
    console.log('add appoint')
    this.addAppointClicked.emit()
  }

  editAppoint(appoint) {
    console.log('Edit appoint', appoint)
    this.addAppointClicked.emit(appoint)
  }

  addTask() {
    console.log('add task')
    this.addTaskClicked.emit(false)
  }
  editTask() {
    console.log('add task')
    this.addTaskClicked.emit(true)
  }

  isPastDate(appoint) {
    const endDate = moment(appoint.end_date_time)
    return endDate < moment()
  }

  upcomingNotification(appoint) {
    const reminderDate = moment(appoint.reminder_date_time)
    return reminderDate.diff(moment(), 'seconds') > 0
  }

  getAppointmentIcon(appoint) {
    if (this.upcomingNotification(appoint)) {
      return 'notification_important'
    }
    return 'calendar_today'
  }

  getAppointDate(appoint) {
    let dateTime = moment(appoint.start_date_time)
    if (this.upcomingNotification(appoint)) {
      dateTime = moment(appoint.reminder_date_time)
    }

    if (moment().isSame(dateTime, 'date')) {
      return `Today at ${dateTime.format('hh:mm A')}`
    }
    if (moment().add(1, 'days').isSame(dateTime, 'd')) {
      return `Tomorrow at ${dateTime.format('hh:mm A')}`
    }
    return moment(appoint.start_date).format('YYYY-MM-DD')
  }

  getLeadsTotalValue() {
    return (this.leads_value?.total_value | 0.0).toFixed(2)
  }

  getLeadsExpectValue() {
    return (this.leads_value?.expected_value | 0.0).toFixed(2)
  }
}
