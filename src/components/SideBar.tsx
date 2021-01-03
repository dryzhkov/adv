import React from 'react';
import { calcTotalDistance, calcTotalHours, normalizeTripDates } from './helpers';
import Spinner from 'react-bootstrap/Spinner';
import './SideBar.css';
import { useQuery } from '@apollo/client';
import { TRIPS_QUERY } from './queries';
import { Trip } from '../interfaces';
import Button from 'react-bootstrap/Button';

interface TripsData {
  trips: Trip[];
}

interface SideBarProps {
  onItemClicked: (itemId: string) => void;
}

export function SideBar(props: SideBarProps) {
  const { onItemClicked } = props;
  const { loading, error, data } = useQuery<TripsData>(TRIPS_QUERY);

  if (error) return <p>Error :(</p>;
  if (loading) return <Spinner animation="border" variant="info" className="centered-spinner" />;

  const trips = data ? data.trips.map(normalizeTripDates) : [];

  trips.sort((a: Trip, b: Trip) => {
    return b.days[0].date.getTime() - a.days[0].date.getTime();
  });

  function renderTrips() {
    const today = new Date();
    let prevYear = trips && trips[0] && trips[0].days ? trips[0].days[0].date.getFullYear() : today.getFullYear();

    return trips.map((t: Trip, index: number) => {
      const curYear = t.days[0].date.getFullYear();
      const output = (
        <li key={t.id}>
          {index === 0 && (
            <section className="year-divider">
              {curYear + 1}
            </section>
          )}
          {curYear !== prevYear && (
            <section className="year-divider">
              {prevYear}
            </section>
          )}

          <div className="sidebar-card" onClick={() => { onItemClicked(t.id) }}>
            <header>
              <strong className="sidebar-item-title">{t.title}</strong>
            </header>
            <Button variant="gray" className="sidebar-open-button"></Button>
            <p className="sidebar-item-body">{t.days[0].date.toDateString()}</p>
            <span>{calcTotalHours(t.days)} hours</span>{' '}
            <span>{calcTotalDistance(t.days)} miles</span>
          </div>

          {/* {index === trips.length - 1 && (
            <section>
              {curYear}
            </section>
          )} */}
        </li>
      );
      prevYear = curYear;
      return output;
    });
  }

  return (
    <ul className="sidebar-list">{renderTrips()}</ul>
  );
}
