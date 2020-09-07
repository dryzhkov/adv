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

export function getTrips(): Promise<Trip[]> {
    return fetch(`${process.env.REACT_APP_ADV_API_BASE}/trips`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return [];
        })
        .catch((ex) => {
            console.log('unable to fetch trips: ' + ex);
            return [];
        });
}

export function getTripDetails(id: number): Promise<Trip | undefined> {
    return fetch(`${process.env.REACT_APP_ADV_API_BASE}/trips/${id}`).then(
        (response) => {
            if (response.ok) {
                return response.json().then((value: Trip) => {
                    // convert date string to date object
                    convertStringToDate(value);
                    return value;
                });
            }
            return undefined;
        }
    );
}

function convertStringToDate(value: Trip) {
    value.days.forEach((d) => {
        d.date = new Date(d.date);
    });
}

export function createTrip(trip: Trip): Promise<number | undefined> {
    // remove id property since this is creating a new trip
    delete trip.id;
    return fetch(`${process.env.REACT_APP_ADV_API_BASE}/trips`, {
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
    return fetch(`${process.env.REACT_APP_ADV_API_BASE}/trips/${trip.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip),
    }).then((response) => {
        return response.ok;
    });
}
