export interface Trip {
    id: number;
    title: string;
    days: Day[];
}

export interface Day {
    date: string;
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
                return response.json();
            }
            return undefined;
        }
    );
}
