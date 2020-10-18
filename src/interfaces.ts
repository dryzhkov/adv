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