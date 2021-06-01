import { EventInput } from '@fullcalendar/angular';
import { NTask } from '../detail/task-dialog/task-dialog';
import * as moment from 'moment';

let eventGuid = 100;

export const INITIAL_TASKS: NTask[] = [
    {
        id: null,
        title: 'Packet Monster Sales',
        content: '',
        due_date: moment('2021-05-31'),
        due_time: '05:00',
        remainder_date: moment('2021-05-31'),
        remainder_time: '',
        owner: '',
    },
    {
        id: null,
        title: 'Ux design meeting', 
        content: '',
        due_date: moment('2021-06-12'),
        due_time: '15:00',
        remainder_date: moment('2021-06-12'),
        remainder_time: '',
        owner: ''
    },
    {
        id: null,
        title: 'Family', 
        content: '',
        due_date: moment('2021-06-23'),
        due_time: '18:00',
        remainder_date: null,
        remainder_time: '',
        owner: ''
    },
    {
        id: null,
        title: 'Presentation', 
        content: '',
        due_date: moment('2021-06-28'),
        due_time: '18:00',
        remainder_date: null,
        remainder_time: '',
        owner: ''
    },
    {
        id: null,
        title: 'Holiday', 
        content: '',
        due_date: moment('2021-07-02'),
        due_time: '18:00',
        remainder_date: null,
        remainder_time: '',
        owner: ''
    }
];

export function createEventId() {
  return String(eventGuid++);
}