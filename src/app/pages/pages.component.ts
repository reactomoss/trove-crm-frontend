import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDialog } from './detail/task-dialog/task-dialog';
import { AppointDialog } from './detail/appoint-dialog/appoint-dialog';

export class Task {
  constructor(public name: string,  public selected?: boolean) {
    if (selected === undefined) selected = false
  }
}
export class Appointment {
  constructor(public name: string, public icon: string , public color: string, public desc: string) {

  }
}
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  tasks: Task[] = [
    new Task("Packet Monster Sales opportunity"),
    new Task("Ux design meeting at 17:30hrs."),
    new Task("Landing page required for new CRM app"),
    new Task("Meeting required for new CRM app"),

  ]
  appointments: Appointment[] = [
    new Appointment("Packet Monster Sales opportunity", "notification", "default", "Today at 11:00"),
    new Appointment("Ux design meeting at 17:30hrs.", "calendar", "red", "Sat, 23 Apr, 2021"),
    new Appointment("Landing page required for new CRM app", "notification", "default", "Sun, 24 Apr, 2021"),
    new Appointment("Meeting required for new CRM app", "calendar", "default", "Mon, 25 Apr, 2021"),
  ]
  colorsourceChart = ['#7184b8']
  sourceChart: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'shadow'
      }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['SMS', 'Website', 'News', 'Task'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Source',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 100, 200]
        }
    ],
    color: this.colorsourceChart,
  };
  colormonthlyChart = ['#c6a887']
  monthlyChart: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'shadow'
      }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Monthly',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 170, 250]
        }
    ],
    color: this.colormonthlyChart,
  };

  colorpipelineChart = ['#ffa33e', '#c6a887', '#7184b8', '#595393']
  pipelineChart: echarts.EChartsOption = {

    tooltip: {
      trigger: 'item'
    },
    legend: {
        bottom: 0,
        left: 'left',
        show: true
    },
    series: [
        {
            name: 'Pipeline',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '13',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 1048, name: 'Pipeline 1'},
                {value: 735, name: 'Pipeline 2'},
                {value: 580, name: 'Pipeline 3'},
                {value: 484, name: 'Pipeline 4'}
            ]
        }
    ],
    color: this.colorpipelineChart,
  };

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
