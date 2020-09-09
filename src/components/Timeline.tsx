import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, Trip } from '../services/tripService';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import './Timeline.css';

export function Timeline() {
    const [trips, setTrips] = useState<Trip[]>([]);
    useEffect(() => {
        getTrips(true /* sort by date */).then((trips) => setTrips(trips));
    }, []);

    function renderTrips() {
        let prevYear =
            trips && trips[0] && trips[0].days
                ? trips[0].days[0].date.getFullYear()
                : new Date().getFullYear();

        return trips.map((t: Trip, index: number) => {
            const curYear = t.days[0].date.getFullYear();
            const output = (
                <div key={t.id}>
                    {index === 0 && (
                        <Badge className="center" variant="info" as="div">
                            {curYear + 1}
                        </Badge>
                    )}
                    {curYear !== prevYear && (
                        <Badge className="center" variant="info" as="div">
                            {prevYear}
                        </Badge>
                    )}
                    <Link to={`/details/${t.id}`}>
                        <div
                            className={
                                index % 2 === 0 ? 'record left' : 'record right'
                            }
                        >
                            <Card className="trip">
                                <Card.Body>
                                    <Card.Title>{t.title}</Card.Title>
                                    <Card.Text>
                                        {t.days[0].date.toDateString()}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </Link>
                    {index === trips.length - 1 && (
                        <Badge className="center" variant="info" as="div">
                            {curYear}
                        </Badge>
                    )}
                </div>
            );
            prevYear = curYear;
            return output;
        });
    }

    return (
        <div id="adv">
            <div className="timeline">{renderTrips()}</div>
        </div>
    );
}
