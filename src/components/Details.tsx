import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import detailsReducer, { TripEdit } from '../reducers/detailsReducer';
import { getTripDetails, Day } from '../services/tripService';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const initialState: TripEdit = {
    trip: {
        id: -1,
        title: '',
        days: [],
    },
    saved: undefined,
    isEditing: false,
    showDatePicker: false,
    selectedDate: new Date(),
    dayIndex: -1,
};

export function Details() {
    let { id } = useParams();
    const [state, dispatch] = useReducer(detailsReducer, initialState);
    const { trip, dayIndex, showDatePicker, selectedDate } = state;
    function getTotalHours() {
        return trip.days.reduce(
            (accumulator: number, currentValue: Day) =>
                accumulator + currentValue.hours,
            0
        );
    }

    function getTotalDistance() {
        return trip.days.reduce(
            (accumulator: number, currentValue: Day) =>
                accumulator + currentValue.distance,
            0
        );
    }

    function renderTripDays() {
        return (
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Distance</th>
                        <th>Hours</th>
                        <th>Directions</th>
                    </tr>
                </thead>
                <tbody>
                    {trip.days.map((d, i) => {
                        if (dayIndex === i) {
                            return (
                                <tr key={i}>
                                    <td>{d.date}</td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="From"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.from}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'updateDay',
                                                        day: {
                                                            date: d.date,
                                                            from:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="To"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.to}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'updateDay',
                                                        day: {
                                                            date: d.date,
                                                            to: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="Distance"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.distance}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'updateDay',
                                                        day: {
                                                            date: d.date,
                                                            distance: Number(
                                                                e.target.value
                                                            ),
                                                        },
                                                    })
                                                }
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="Hours"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.hours}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'updateDay',
                                                        day: {
                                                            date: d.date,
                                                            hours: Number(
                                                                e.target.value
                                                            ),
                                                        },
                                                    })
                                                }
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="Directions"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.directions}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'updateDay',
                                                        day: {
                                                            date: d.date,
                                                            directions:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </InputGroup>
                                    </td>
                                </tr>
                            );
                        } else {
                            return (
                                <tr
                                    key={i}
                                    onClick={() =>
                                        dispatch({
                                            type: 'startEditing',
                                            dayIndex: i,
                                        })
                                    }
                                >
                                    <td>{d.date}</td>
                                    <td>{d.from}</td>
                                    <td>{d.to}</td>
                                    <td>{d.distance}</td>
                                    <td>{d.hours}</td>
                                    <td>{displayMaps(d.directions)}</td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </Table>
        );
    }

    function displayMaps(url: string) {
        if (url) {
            return (
                <Button
                    variant="info"
                    onClick={(event) => {
                        event.stopPropagation();
                        window.open(url, '_blank');
                    }}
                >
                    Maps
                </Button>
            );
        }
    }

    function handleSaveTrip() {
        dispatch({ type: 'stopEditing' });
    }

    function handleDiscard() {
        dispatch({ type: 'discard' });
    }

    useEffect(() => {
        getTripDetails(id).then(
            (t) => t && dispatch({ type: 'requestTripSuccess', trip: t })
        );
    }, [id]);

    return (
        <>
            <h1>{trip.title}</h1>
            <ListGroup horizontal>
                <ListGroup.Item>
                    {' '}
                    <Card className="bg-dark text-white" body>
                        Total Hours: {getTotalHours()}
                    </Card>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Card className="bg-dark text-white" body>
                        Total distance: {getTotalDistance()}
                    </Card>
                </ListGroup.Item>
            </ListGroup>
            <div>
                <Button
                    variant="primary"
                    size="lg"
                    active
                    onClick={() => dispatch({ type: 'showDatePicker' })}
                >
                    Add day
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    active
                    onClick={handleSaveTrip}
                    disabled={dayIndex === -1}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    active
                    onClick={handleDiscard}
                    disabled={dayIndex === -1}
                >
                    Discard
                </Button>
                <Modal
                    show={showDatePicker}
                    onHide={() => dispatch({ type: 'hideDatePicker' })}
                    centered
                    animation={false}
                >
                    <Modal.Body className="table-dark">
                        <DayPicker
                            showOutsideDays
                            todayButton="Go to Today"
                            selectedDays={[selectedDate]}
                            onDayClick={(date) => {
                                if (date) {
                                    dispatch({ type: 'selectDate', date });
                                }
                            }}
                        ></DayPicker>
                    </Modal.Body>
                    <Modal.Footer className="table-dark">
                        <Button
                            variant="secondary"
                            onClick={() => dispatch({ type: 'hideDatePicker' })}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                dispatch({ type: 'save' });
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                {trip ? renderTripDays() : <div>Loading your trip...</div>}
            </div>
        </>
    );
}
