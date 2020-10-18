import { Day, Trip } from '../interfaces';

export function convertTripToInput(trip: Trip) {
  return {
    title: trip.title,
    days: trip.days.map(d => {
      return {
        date: d.date.toUTCString(),
        from: d.from,
        to: d.to,
        distance: d.distance,
        hours: d.hours,
        directions: d.directions,
      };
    }),
    imageUrls: trip.imageUrls ? [...trip.imageUrls] : [],
  };
}

export function calcTotalHours(days: Day[]) {
  return days ? days.reduce((accumulator: number, currentValue: Day) => accumulator + currentValue.hours, 0) : 0;
}

export function calcTotalDistance(days: Day[]) {
  return days ? days.reduce((accumulator: number, currentValue: Day) => accumulator + currentValue.distance, 0) : 0;
}

export function normalizeTripDates(trip: Trip) {
  return {
    ...trip,
    days: trip.days.map(d => {
      return {
        ...d,
        date: new Date(d.date),
      };
    }),
  };
}
