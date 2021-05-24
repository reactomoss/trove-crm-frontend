import { EventInput } from '@fullcalendar/angular';
import { NTask } from '../detail/task-dialog/task-dialog';
import * as moment from 'moment';

let eventGuid = 100;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

/*export const INITIAL_EVENTS: EventInput[] = [
  {
    id: '1',
    title: 'Packet Monster Sales opportunity',
    date: '2021-05-03', 
    extendedProps: {
        isTask: true,
        task: {
            id: '1',
            title: 'Packet Monster Sales opportunity',
            due_date: moment('2021-05-03'),
            due_time: '05:00',
        }
    }
  },
  {
    id: '2',
    title: 'Ux design meeting', 
    date: '2021-05-12', 
    extendedProps: {
        isTask: true,
        task: {
            id: '2',
            title: 'Ux design meeting', 
            due_date: moment('2021-05-12'),
            due_time: '15:00',
        }
    }
  },
  {
    id: '3',
    title: 'Family', 
    date: '2021-05-23', 
    extendedProps: {
        isTask: true,
        task: {
            id: '3',
            title: 'Family', 
            due_date: moment('2021-05-23'),
            due_time: '18:00',
        }
    },
    color: '#f9e8ec',
    textColor: '#d5617a'
  },
  {
    id: '4',
    title: 'Presentation', 
    date: '2021-05-28', 
    extendedProps: {
        isTask: true,
        task: {
            id: '4',
            title: 'Presentation', 
            due_date: moment('2021-05-28'),
            due_time: '18:00',
        }
    },
    color: '#f9e8ec',
    textColor: '#d5617a'
  }
];*/

export const INITIAL_TASKS: NTask[] = [
    {
        id: null,
        title: 'Packet Monster Sales',
        content: '',
        due_date: moment('2021-05-03'),
        due_time: '05:00',
        remainder_date: '',
        remainder_time: '',
        owner: '',
    },
    {
        id: null,
        title: 'Ux design meeting', 
        content: '',
        due_date: moment('2021-05-12'),
        due_time: '15:00',
        remainder_date: '',
        remainder_time: '',
        owner: ''
    },
    {
        id: null,
        title: 'Family', 
        content: '',
        due_date: moment('2021-05-23'),
        due_time: '18:00',
        remainder_date: '',
        remainder_time: '',
        owner: ''
    },
    {
        id: null,
        title: 'Presentation', 
        content: '',
        due_date: moment('2021-05-28'),
        due_time: '18:00',
        remainder_date: '',
        remainder_time: '',
        owner: ''
    }
];

export function createEventId() {
  return String(eventGuid++);
}