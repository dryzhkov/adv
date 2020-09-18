import React, {
    useEffect,
    useReducer,
    useCallback,
    useRef,
    useState,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';
import detailsReducer, { TripEdit } from '../reducers/detailsReducer';
import {
    createTrip,
    deleteTrip,
    updateTrip,
    getTripDetails,
    calcTotalDistance,
    calcTotalHours,
} from '../services/tripService';
import DayPicker from 'react-day-picker';
import { Carousel } from './Carousel';
import 'react-day-picker/lib/style.css';
import './Details.css';

const initialState: TripEdit = {
    trip: {
        id: '',
        title: '',
        days: [],
    },
    saved: undefined,
    isEditing: false,
    showDatePicker: false,
    selectedDate: new Date(),
    dayIndex: -1,
};

const imageUrls = [
    'https://mq42nq.bn.files.1drv.com/y4mkGhLvcRuWb-1HPmuTEpVhXrHwEC7XHdYrwEw6SBas7idA2QTk6vdXnUiuckIO4UGM_LW_DBdWt28ECmULM_GCSdoIYTf6piYnek57snh31LIG7WtI7QpXqa3488Me0ZbC2TOQ1ncEp3PITSlglC651wdLjrrDL93t1XNLs98DlLQi2UZ0KKB5HlSsgWOD2a476tpuTNQ7TMWeq_00vrV5A?width=1024&height=768&cropmode=none',
    'https://mq4wnq.bn.files.1drv.com/y4mfTXBOkUGJS073jNJBI4vBgWhy6Pvn1hHHkr2ossb_H-oMtblSMBmFSFJCuEHhU6U_hiQc2lpys9V_-Ujx_9cchGZRkj-jN2YL1Pyg4HtQYYbZm6UBh6XqL-LCA4fAevPZsO2jIu9OQ97lIQqBxAM8hkhEj_4baSfFEJCaFmpHr-gSwrAU6RKG3ELppK1jaPeJY4o-l_dmn9XmlepK5Xmlw?width=1024&height=768&cropmode=none',
    'https://mq43nq.bn.files.1drv.com/y4mSexKLEO75ou9JHu27n7iEH1u8zvakLAYCoGRDTlDy-OXd6yiY69tiLo93dkFvr3hiUEFCiEQDPs2U4hH99zSWj0b927SO6oCh4NddqPXh-JeX35RDnNK1NyYphx187xeh_QlJdNwsVNjeTfY4eGHOpceeMvWQua49YrlrXqmFeKuwpvBIFvvi2Rz2G6cIJIDZg2ER13M9v6oqtFeEgprdw?width=1024&height=768&cropmode=none',
];

export function Details() {
    const { id } = useParams();
    const history = useHistory();
    const [state, dispatch] = useReducer(detailsReducer, initialState);
    const deleteRef = useRef(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        variant: 'info',
    });
    const { trip, dayIndex, showDatePicker, selectedDate, isEditing } = state;

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
                    {trip.days &&
                        trip.days.map((d, i) => {
                            if (isEditing && dayIndex === i) {
                                return (
                                    <tr key={i}>
                                        <td>
                                            {d.date.toDateString()}{' '}
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => {
                                                    dispatch({
                                                        type: 'removeDay',
                                                        index: i,
                                                    });
                                                }}
                                                size="sm"
                                                className="removeDayBtn"
                                            >
                                                Remove
                                            </Button>
                                        </td>
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
                                                                    e.target
                                                                        .value,
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
                                                                to:
                                                                    e.target
                                                                        .value,
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
                                                                    e.target
                                                                        .value
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
                                                                    e.target
                                                                        .value
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
                                                                    e.target
                                                                        .value,
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
                    size="sm"
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
                    Delete Trip
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
                    Time: {calcTotalHours(trip.days)} h
                </Badge>
                <Badge variant="success" as="div" className="info-badge">
                    Distance: {calcTotalDistance(trip.days)} mi
                </Badge>
            </>
        );
    }

    // eslint-disable-next-line
    function handleSave() {
        if (!trip.title) {
            setAlert({
                show: true,
                variant: 'danger',
                message: 'Give the trip a meaningful title',
            });
            return;
        }
        if (!trip.days || trip.days.length === 0) {
            setAlert({
                show: true,
                variant: 'danger',
                message: 'Add at least 1 day before saving',
            });
            return;
        }
        dispatch({ type: 'save' });
        if (trip.id === '') {
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

    const memoizedKeydown = useCallback(
        function (event: KeyboardEvent) {
            if (!isEditing) return;

            if (event.keyCode === 27) {
                // ESC key code
                dispatch({ type: 'stopEditing' });
            } else if (event.keyCode === 13) {
                // ENTER
                handleSave();
            }
        },
        [isEditing, handleSave]
    );

    useEffect(() => {
        if (id !== 'new') {
            setLoading(true);
            getTripDetails(id).then((t) => {
                t && dispatch({ type: 'requestTripSuccess', trip: t });
                setLoading(false);
            });
        }
    }, [id]);

    useEffect(() => {
        document.addEventListener('keydown', memoizedKeydown);
        return () => {
            document.removeEventListener('keydown', memoizedKeydown);
        };
    }, [memoizedKeydown]);

    return (
        <>
            {loading && (
                <Spinner
                    animation="border"
                    variant="info"
                    className="centered-spinner"
                />
            )}
            {!loading && (
                <div className="content">
                    <Alert
                        variant={alert.variant}
                        onClose={() => setAlert({ ...alert, show: false })}
                        show={alert.show}
                        dismissible
                    >
                        <p>{alert.message}</p>
                    </Alert>
                    {displayControls()}
                    {displayTotals()}
                    {displayTitle()}
                    {displayTripDays()}
                    <Carousel imageUrls={imageUrls} />
                </div>
            )}
        </>
    );
}
