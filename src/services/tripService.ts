export interface Trip {
    id: string;
    title: string;
    days: Day[];
    imageUrls?: string[];
}

export interface Day {
    date: Date;
    from: string;
    to: string;
    distance: number;
    hours: number;
    directions: string;
}

const baseAPI = '/.netlify/functions';

export function createTrip(trip: Trip): Promise<number | undefined> {
    // remove id property since this is creating a new trip
    delete trip.id;
    return fetch(`${baseAPI}/create-trip`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip),
    }).then((response) => {
        if (response.ok) {
            return response.json().then((value) => value.id);
        }
    });
}

export function updateTrip(trip: Trip): Promise<boolean> {
    return fetch(`${baseAPI}/update-trip/${trip.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip),
    }).then((response) => {
        return response.ok;
    });
}

export function deleteTrip(tripId: string): Promise<boolean> {
    return fetch(`${baseAPI}/delete-trip/${tripId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        return response.ok;
    });
}

export function calcTotalHours(days: Day[]) {
    return days
        ? days.reduce(
              (accumulator: number, currentValue: Day) =>
                  accumulator + currentValue.hours,
              0
          )
        : 0;
}

export function calcTotalDistance(days: Day[]) {
    return days
        ? days.reduce(
              (accumulator: number, currentValue: Day) =>
                  accumulator + currentValue.distance,
              0
          )
        : 0;
}

function convertStringToDate(t: Trip) {
    t.days.forEach((d) => {
        d.date = new Date(d.date);
    });
}
