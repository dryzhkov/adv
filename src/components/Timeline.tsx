import React, { useState, useEffect } from 'react';
import { getTrips } from '../services/tripService';
import './Timeline.css';

export function Home() {
    const [trips, setTrips] = useState<any[]>([]);
    useEffect(() => {
        getTrips().then((trips) => setTrips(trips));
    }, []);

    function renderTrips() {
        return trips.map((t: any, index: number) => {
            return (
                <div
                    key={t.id}
                    className={index % 2 === 0 ? 'record left' : 'record right'}
                >
                    <div className="trip">
                        <h2>{t.title}</h2>
                        <h3>{JSON.stringify(t.days)}</h3>
                    </div>
                </div>
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
