import moment from 'moment';

export function diffInDays (startDate, finalDate) {
  const start = moment(startDate);
  const final = moment(finalDate);
  return final.diff(start, 'days');
}

export function diffInDaysToday (date) {
  return diffInDays(moment().startOf('day'), date);
}

export function todayForCalendar (daysAdd = 0) {
  return moment().startOf('day').add(daysAdd, 'days').format('YYYY-MM-DD');
}
