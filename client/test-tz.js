import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());

const startTime = "2026-07-16T14:35:00.000Z";
console.log("raw dayjs:", dayjs(startTime).format('h:mm A'));
console.log("dayjs.tz():", dayjs(startTime).tz().format('h:mm A'));
console.log("dayjs.utc():", dayjs.utc(startTime).local().format('h:mm A'));
