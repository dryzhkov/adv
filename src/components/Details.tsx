import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { getTripDetails, Trip, Day } from '../services/tripService';

const defaultTrip: Trip = {
    id: -1,
    title: '',
    days: [],
};

type PartialDay = {
    [P in keyof Day]?: Day[P];
};

interface EditTrip {
    prevTrip: Trip | undefined;
    dayIndex: number;
}

export function Details() {
    let { id } = useParams();
    const [trip, setTrip] = useState<Trip>(defaultTrip);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [edit, setEdit] = useState<EditTrip>({
        dayIndex: -1,
        prevTrip: undefined,
    });

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
                    {trip!.days.map((d, i) => {
                        if (edit.dayIndex === i) {
                            return (
                                <tr key={i}>
                                    <td>{d.date}</td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="From"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.from}
                                                onChange={(e) => {
                                                    handleDayChange({
                                                        date: d.date,
                                                        from: e.target.value,
                                                    });
                                                }}
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="To"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.to}
                                                onChange={(e) => {
                                                    handleDayChange({
                                                        date: d.date,
                                                        to: e.target.value,
                                                    });
                                                }}
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="Distance"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.distance}
                                                onChange={(e) => {
                                                    handleDayChange({
                                                        date: d.date,
                                                        distance: Number(
                                                            e.target.value
                                                        ),
                                                    });
                                                }}
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="Hours"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.hours}
                                                onChange={(e) => {
                                                    handleDayChange({
                                                        date: d.date,
                                                        hours: Number(
                                                            e.target.value
                                                        ),
                                                    });
                                                }}
                                            />
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <InputGroup size="sm">
                                            <FormControl
                                                aria-label="Directions"
                                                aria-describedby="inputGroup-sizing-sm"
                                                defaultValue={d.directions}
                                                onChange={(e) => {
                                                    handleDayChange({
                                                        date: d.date,
                                                        directions:
                                                            e.target.value,
                                                    });
                                                }}
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
                                        setEdit((prevState) => {
                                            if (!prevState.prevTrip) {
                                                return {
                                                    prevTrip: { ...trip },
                                                    dayIndex: i,
                                                };
                                            }
                                            return {
                                                prevTrip: prevState.prevTrip,
                                                dayIndex: i,
                                            };
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

    function handleDayChange(day: PartialDay) {
        const days = [...trip.days];

        let indexToUpdate = days.findIndex((d) => d.date === day.date);

        if (indexToUpdate > -1) {
            days[indexToUpdate] = { ...days[indexToUpdate], ...day };
        }

        setTrip({
            ...trip,
            days,
        });
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

    function addDayClick() {
        setShowDatePicker(true);
    }

    function handleSaveTrip() {
        setEdit({ ...edit, dayIndex: -1 });
    }

    function handleDiscard() {
        if (edit.prevTrip) {
            setTrip({ ...edit.prevTrip });
        }

        setEdit({ prevTrip: undefined, dayIndex: -1 });
    }

    useEffect(() => {
        getTripDetails(id).then((t) => t && setTrip(t));
    }, [id]);

    return (
        <>
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
                    onClick={addDayClick}
                >
                    Add day
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    active
                    onClick={handleSaveTrip}
                    disabled={edit.dayIndex === -1}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    active
                    onClick={handleDiscard}
                    disabled={edit.dayIndex === -1}
                >
                    Discard
                </Button>
                <Modal
                    show={showDatePicker}
                    onHide={() => setShowDatePicker(false)}
                    centered
                    animation={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DatePicker
                            selectsRange={false}
                            selected={selectedDate}
                            onChange={(date) => {
                                if (date) {
                                    if (Array.isArray(date)) {
                                        setSelectedDate(date[0]);
                                    } else {
                                        setSelectedDate(date);
                                    }
                                }
                            }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDatePicker(false)}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                const indexToEdit = trip.days.length;
                                const emtpyDay = {
                                    date: selectedDate?.toDateString(),
                                    from: '',
                                    to: '',
                                    distance: 0,
                                    hours: 0,
                                    directions: '',
                                };
                                setTrip({
                                    ...trip,
                                    days: trip.days.concat(emtpyDay),
                                });
                                setShowDatePicker(false);
                                setEdit({
                                    ...edit,
                                    dayIndex: indexToEdit,
                                });
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
