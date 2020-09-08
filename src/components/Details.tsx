import React, {
    useEffect,
    useReducer,
    useCallback,
    useRef,
    useState,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import detailsReducer, { TripEdit } from '../reducers/detailsReducer';
import {
    createTrip,
    deleteTrip,
    updateTrip,
    getTripDetails,
    Day,
} from '../services/tripService';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './Details.css';

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
    const { id } = useParams();
    const history = useHistory();
    const [state, dispatch] = useReducer(detailsReducer, initialState);
    const deleteRef = useRef(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { trip, dayIndex, showDatePicker, selectedDate, isEditing } = state;

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

    function displayTripDays() {
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
                        if (isEditing && dayIndex === i) {
                            return (
                                <tr key={i}>
                                    <td>{d.date.toDateString()}</td>
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
                                    className="editable"
                                >
                                    <td>{d.date.toDateString()}</td>
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

    function displayTitle() {
        if (isEditing) {
            return (
                <InputGroup size="lg">
                    <FormControl
                        aria-label="Title"
                        aria-describedby="inputGroup-sizing-sm"
                        defaultValue={trip.title || ''}
                        placeholder={
                            !trip.title ? 'Give this trip a title' : ''
                        }
                        onChange={(e) =>
                            dispatch({
                                type: 'updateTitle',
                                title: e.target.value,
                            })
                        }
                        className="tripTitle"
                    />
                </InputGroup>
            );
        } else {
            return (
                <Button
                    variant="info"
                    onClick={() =>
                        dispatch({
                            type: 'startEditing',
                        })
                    }
                    size="lg"
                    block
                    className="editable tripTitle"
                >
                    {trip.title}
                </Button>
            );
        }
    }

    function displayControls() {
        return (
            <div className="wrapper">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => dispatch({ type: 'showDatePicker' })}
                >
                    Add day
                </Button>
                <Button
                    variant="success"
                    size="lg"
                    onClick={handleSave}
                    disabled={!isEditing}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => dispatch({ type: 'discard' })}
                    disabled={!isEditing}
                >
                    Discard
                </Button>
                <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleDelete()}
                    ref={deleteRef}
                >
                    Delete
                </Button>
                <Overlay
                    target={deleteRef.current}
                    show={confirmDelete}
                    placement="top"
                    rootClose={true}
                    onHide={() => {
                        setConfirmDelete(false);
                    }}
                >
                    {(props) => (
                        <Tooltip id="delete-overlay" {...props}>
                            Click delete button again to confirm!
                        </Tooltip>
                    )}
                </Overlay>
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
                                dispatch({ type: 'addDay' });
                            }}
                        >
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    function displayTotals() {
        return (
            <>
                <Badge variant="primary" as="div" className="info-badge">
                    Time: {getTotalHours()} h
                </Badge>
                <Badge variant="success" as="div" className="info-badge">
                    Distance: {getTotalDistance()} mi
                </Badge>
            </>
        );
    }

    function handleSave() {
        dispatch({ type: 'save' });
        if (trip.id === -1) {
            // creating a new trip
            createTrip(trip).then((tripId) => {
                if (tripId) {
                    history.push(`/details/${tripId}`);
                } else {
                    console.log('something went wrong');
                }
            });
        } else {
            // updating existing trip
            console.log('Updating trip: ', trip);
            updateTrip(trip).then((success) => {
                if (success) {
                    console.log('updated');
                } else {
                    console.log('something went wrong, couldnt update trip');
                }
            });
        }
    }

    function handleDelete() {
        if (confirmDelete) {
            deleteTrip(state.trip.id).then((isSuccess) => {
                if (isSuccess) {
                    history.push('/');
                }
            });
        }
        setConfirmDelete(!confirmDelete);
    }

    const memoizedHandleEsc = useCallback(
        function handleEsc(event: KeyboardEvent) {
            // ESC key code
            if (event.keyCode === 27 && isEditing) {
                dispatch({ type: 'stopEditing' });
            }
        },
        [isEditing]
    );

    useEffect(() => {
        if (!isNaN(Number(id))) {
            getTripDetails(id).then(
                (t) => t && dispatch({ type: 'requestTripSuccess', trip: t })
            );
        }
    }, [id]);

    useEffect(() => {
        document.addEventListener('keydown', memoizedHandleEsc);
        return () => {
            document.removeEventListener('keydown', memoizedHandleEsc);
        };
    }, [memoizedHandleEsc]);

    return (
        <div className="content">
            {displayControls()}
            {displayTotals()}
            {displayTitle()}
            {displayTripDays()}
        </div>
    );
}
