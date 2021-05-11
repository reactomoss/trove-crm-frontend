import { EventInput } from '@fullcalendar/angular';

let eventGuid = 1;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'Packet Monster Sales opportunity',
    start: '2021-05-05', 
    end: '2021-05-10',
    extendedProps: {
        "type": "appointment",
    }
  },
  {
    id: createEventId(),
    title: 'Ux design meeting at 17:30hrs.', 
    date: '2021-05-08', 
    extendedProps: {
        "type": "task",
    }
  }
];

export function createEventId() {
  return String(eventGuid++);
}