export interface Trip {
    id: number;
    title: string;
    days: Day[];
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

export function getTrips(sortByDate?: boolean): Promise<Trip[]> {
    return fetch(`${baseAPI}/get-trips`)
        .then((response) => {
            if (response.ok) {
                return response.json().then((trips: Trip[]) => {
                    trips.forEach((t) => convertStringToDate(t));

                    if (sortByDate) {
                        trips.sort((a: Trip, b: Trip) => {
                            return (
                                b.days[0].date.getTime() -
                                a.days[0].date.getTime()
                            );
                        });
                    }
                    return trips;
                });
            }
            return [];
        })
        .catch((ex) => {
            console.log('unable to fetch trips: ' + ex);
            return [];
        });
}

export function getTripDetails(id: number): Promise<Trip | undefined> {
    return fetch(`${baseAPI}/trips/${id}`).then((response) => {
        if (response.ok) {
            return response.json().then((t: Trip) => {
                // convert date string to date object
                if (t && t.days) {
                    convertStringToDate(t);
                    t.days.sort((a: Day, b: Day) => {
                        return a.date.getTime() - b.date.getTime();
                    });
                }

                return t;
            });
        }
        return undefined;
    });
}

function convertStringToDate(t: Trip) {
    t.days.forEach((d) => {
        d.date = new Date(d.date);
    });
}

export function createTrip(trip: Trip): Promise<number | undefined> {
    // remove id property since this is creating a new trip
    delete trip.id;
    return fetch(`${baseAPI}/trips`, {
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
    return fetch(`${baseAPI}/trips/${trip.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip),
    }).then((response) => {
        return response.ok;
    });
}

export function deleteTrip(tripId: number): Promise<boolean> {
    return fetch(`${baseAPI}/trips/${tripId}`, {
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
