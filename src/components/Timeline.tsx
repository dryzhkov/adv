import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, Trip } from '../services/tripService';
import './Timeline.css';

export function Timeline() {
    const [trips, setTrips] = useState<Trip[]>([]);
    useEffect(() => {
        getTrips().then((trips) => setTrips(trips));
    }, []);

    function renderTrips() {
        return trips.map((t: Trip, index: number) => {
            return (
                <Link to={`/details/${t.id}`} key={t.id}>
                    <div
                        className={
                            index % 2 === 0 ? 'record left' : 'record right'
                        }
                    >
                        <div className="trip">
                            <h2>{t.title}</h2>
                        </div>
                    </div>
                </Link>
            );
        });
    }

    return (
        <div id="adv">
            <h2 id="page-title">Adventure Timeline</h2>
            <div className="timeline">{renderTrips()}</div>
        </div>
    );
}
