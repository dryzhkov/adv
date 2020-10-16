import React from 'react';
import { Link } from 'react-router-dom';
import { Trip, calcTotalDistance, calcTotalHours } from '../services/tripService';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import './Timeline.css';
import { gql, useQuery } from '@apollo/client';

interface TripsData {
  trips: Trip[];
}

const TRIPS_QUERY = gql`
  query GetTrips {
    trips {
      id
      title
      days {
        date
        distance
        hours
      }
    }
  }
`;

export function Timeline() {
  const { loading, error, data } = useQuery<TripsData>(TRIPS_QUERY);

  if (error) return <p>Error :(</p>;
  if (loading) return <Spinner animation="border" variant="info" className="centered-spinner" />;

  const trips = data
    ? data.trips.map(t => {
        return {
          ...t,
          days: t.days.map(d => {
            return {
              ...d,
              date: new Date(d.date),
            };
          }),
        };
      })
    : [];

  trips.sort((a: Trip, b: Trip) => {
    return b.days[0].date.getTime() - a.days[0].date.getTime();
  });

  function renderTrips() {
    const today = new Date();
    let prevYear = trips && trips[0] && trips[0].days ? trips[0].days[0].date.getFullYear() : today.getFullYear();

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
            <div className={index % 2 === 0 ? 'record left' : 'record right'}>
              <Card className="trip">
                <Card.Body>
                  <Card.Title>{t.title}</Card.Title>
                  <Card.Text>{t.days[0].date.toDateString()}</Card.Text>
                  <Badge variant="primary">{calcTotalHours(t.days)} hours</Badge>{' '}
                  <Badge variant="success">{calcTotalDistance(t.days)} miles</Badge>
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
