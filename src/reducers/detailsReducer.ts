import { Trip, Day } from '../services/tripService';

export type PartialDay = {
    [P in keyof Day]?: Day[P];
};

export interface TripEdit {
    trip: Trip;
    saved: Trip | undefined;
    isEditing: boolean;
    showDatePicker: boolean;
    selectedDate: Date;
    dayIndex: number;
}

export default function (state: TripEdit, action: EditAction): TripEdit {
    const { selectedDate, trip, saved } = state;
    switch (action.type) {
        case 'showDatePicker':
            return {
                ...state,
                showDatePicker: true,
            };
        case 'hideDatePicker':
            return {
                ...state,
                showDatePicker: false,
            };
        case 'selectDate':
            return {
                ...state,
                selectedDate: action.date,
            };

        case 'save':
            const savedTrip = {
                ...trip,
                days: [...trip.days],
            };
            return {
                ...state,
                trip: {
                    ...trip,
                    days: [...trip.days],
                },
                saved: savedTrip,
                dayIndex: -1,
                isEditing: false,
            };
        case 'addDay':
            const indexToEdit = trip.days.length;
            const newDay = {
                date: selectedDate,
                from: '',
                to: '',
                distance: 0,
                hours: 0,
                directions: '',
            };
            return {
                ...state,
                trip: {
                    ...trip,
                    days: trip.days.concat(newDay),
                },
                saved: saved || state.trip,
                dayIndex: indexToEdit,
                isEditing: true,
                showDatePicker: false,
            };
        case 'stopEditing':
            return {
                ...state,
                isEditing: false,
                dayIndex: -1,
            };
        case 'startEditing':
            return {
                ...state,
                saved: saved || state.trip,
                isEditing: true,
                dayIndex: action.dayIndex !== undefined ? action.dayIndex : -1,
            };
        case 'discard':
            return {
                ...state,
                trip: { ...saved! },
                saved: undefined,
                isEditing: false,
                dayIndex: -1,
            };
        case 'requestTripSuccess':
            return {
                ...state,
                trip: action.trip,
            };
        case 'updateDay':
            const days = [...state.trip.days];

            let indexToUpdate = days.findIndex(
                (d) => d.date === action.day.date
            );

            if (indexToUpdate > -1) {
                days[indexToUpdate] = { ...days[indexToUpdate], ...action.day };
            }

            return {
                ...state,
                trip: {
                    ...state.trip,
                    days,
                },
            };
        case 'updateTitle':
            return {
                ...state,
                trip: {
                    ...state.trip,
                    title: action.title,
                },
            };
    }
    throw new Error('unknow action: ' + JSON.stringify(action));
}

export type EditAction =
    | { type: 'request' }
    | { type: 'showDatePicker' }
    | { type: 'hideDatePicker' }
    | { type: 'selectDate'; date: Date }
    | { type: 'save' }
    | { type: 'addDay' }
    | { type: 'stopEditing' }
    | { type: 'startEditing'; dayIndex?: number }
    | { type: 'discard' }
    | { type: 'requestTripSuccess'; trip: Trip }
    | { type: 'updateDay'; day: PartialDay }
    | { type: 'updateTitle'; title: string };
