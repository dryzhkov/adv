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
        return trips.map((t: Trip, index: number) => {
            return (
                <>
                    <Link to={`/details/${t.id}`} key={t.id}>
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

                    {index === 0 && (
                        <Badge className="center" variant="info" as="div">
                            2020
                        </Badge>
                    )}
                </>
            );
        });
    }

    return (
        <div id="adv">
            {/* <h2 id="page-title">Adventure Timeline</h2> */}
            <div className="timeline">{renderTrips()}</div>
        </div>
    );
}
