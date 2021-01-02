import React, { useEffect, useReducer, useCallback, useRef, useState } from 'react';
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
import { calcTotalDistance, calcTotalHours, convertTripToInput } from './helpers';
import DayPicker from 'react-day-picker';
import { Carousel } from './Carousel';
import 'react-day-picker/lib/style.css';
import './Details.css';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TRIP, DELETE_TRIP, GET_TRIP_BY_ID_QUERY, TRIPS_QUERY, UPDATE_TRIP } from './queries';
import { Trip } from '../interfaces';

import { calculateRoute, generateKML, initializeMaps } from '../maps';

const initialState: TripEdit = {
  trip: {
    id: '',
    title: '',
    days: [],
    imageUrls: [],
  },
  saved: undefined,
  isEditing: false,
  showDatePicker: false,
  selectedDate: new Date(),
  dayIndex: -1,
};

interface TripData {
  trip: Trip;
}
interface TripVars {
  id: string;
}

export function Details() {
  const { id } = useParams<{ id: string }>();
  const isCreateNew = id === 'new';
  const { loading, error, data } = useQuery<TripData, TripVars>(GET_TRIP_BY_ID_QUERY, {
    variables: { id },
    skip: isCreateNew,
  });

  const [createTrip, { loading: createLoading }] = useMutation(CREATE_TRIP);
  const [updateTrip, { loading: updateLoading }] = useMutation(UPDATE_TRIP);
  const [deleteTrip, { loading: deleteLoading }] = useMutation(DELETE_TRIP);

  const history = useHistory();
  const [state, dispatch] = useReducer(detailsReducer, initialState);
  const deleteRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'info',
  });

  const [mapsLoaded, setMapsLoaded] = useState(false);

  const { trip, dayIndex, showDatePicker, selectedDate, isEditing } = state;

  const initializeGoogleMapsRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      initializeMaps(node).then(() => setMapsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (trip && mapsLoaded) {
      calculateRoute({ from: trip.days[0].from.toLowerCase(), to: trip.days[0].to.toLowerCase() });
    }
  }, [trip, mapsLoaded]);

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
                      {d.date.toDateString()}
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => {
                          dispatch({ type: 'showDatePicker', selectedDate: d.date });
                        }}
                        className="changeDateBtn"
                      >
                        Change
                      </Button>
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
                          onChange={e =>
                            dispatch({
                              type: 'updateDay',
                              day: {
                                date: d.date,
                                from: e.target.value,
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
                          onChange={e =>
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
                          onChange={e =>
                            dispatch({
                              type: 'updateDay',
                              day: {
                                date: d.date,
                                distance: Number(e.target.value),
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
                          onChange={e =>
                            dispatch({
                              type: 'updateDay',
                              day: {
                                date: d.date,
                                hours: Number(e.target.value),
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
                          onChange={e =>
                            dispatch({
                              type: 'updateDay',
                              day: {
                                date: d.date,
                                directions: e.target.value,
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
        <>
          <Button
            variant="info"
            size="sm"
            onClick={event => {
              event.stopPropagation();
              window.open(url, '_blank');
            }}
          >
            Maps
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={event => {
              event.stopPropagation();
              generateKML();
            }}
          >
            KML
          </Button>
        </>
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
            placeholder={!trip.title ? 'Give this trip a title' : ''}
            onChange={e =>
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
          onClick={() => {
            dispatch({ type: 'stopEditing' });
            dispatch({ type: 'showDatePicker', selectedDate: new Date() });
          }}
        >
          Add day
        </Button>
        <Button variant="success" size="lg" onClick={handleSave} disabled={!isEditing}>
          Save
        </Button>
        <Button variant="secondary" size="lg" onClick={() => dispatch({ type: 'discard' })} disabled={!isEditing}>
          Discard
        </Button>
        <Button variant="danger" size="lg" onClick={() => handleDelete()} ref={deleteRef}>
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
          {props => (
            <Tooltip id="delete-overlay" {...props}>
              Click delete button again to confirm!
            </Tooltip>
          )}
        </Overlay>
        <Modal show={showDatePicker} onHide={() => dispatch({ type: 'hideDatePicker' })} centered animation={false}>
          <Modal.Body className="table-dark">
            <DayPicker
              month={selectedDate}
              showOutsideDays
              todayButton="Go to Today"
              selectedDays={[selectedDate]}
              onDayClick={date => {
                if (date) {
                  dispatch({ type: 'selectDate', date });
                }
              }}
            ></DayPicker>
          </Modal.Body>
          <Modal.Footer className="table-dark">
            <Button variant="secondary" onClick={() => dispatch({ type: 'hideDatePicker' })}>
              Close
            </Button>
            {dayIndex === -1 && (
              <Button
                variant="primary"
                onClick={() => {
                  dispatch({ type: 'addDay' });
                }}
              >
                Add
              </Button>
            )}
            {dayIndex !== -1 && (
              <Button
                variant="primary"
                onClick={() => {
                  dispatch({
                    type: 'updateDay',
                    day: {
                      date: selectedDate,
                    },
                    indexToUpdate: dayIndex,
                  });

                  dispatch({ type: 'hideDatePicker' });
                }}
              >
                Change
              </Button>
            )}
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
      createTrip({
        variables: {
          input: convertTripToInput(trip),
        },
        update: (cache, { data: { addItem } }) => {
          try {
            const data = cache.readQuery<{ trips: Trip[] }>({ query: TRIPS_QUERY });
            const trips = data ? [...data.trips, addItem] : [addItem];
            cache.writeQuery({ query: TRIPS_QUERY, data: { trips } });
          } catch (e) {
            console.log(e, data);
          }
        },
      }).then(res => {
        if (res.data?.createTrip?.id) {
          history.push(`/details/${res.data.createTrip.id}`);
        } else {
          console.log('something went wrong');
        }
      });
    } else {
      // updating existing trip
      updateTrip({
        variables: {
          id: trip.id,
          input: convertTripToInput(trip),
        },
      });
    }
  }

  function handleDelete() {
    if (confirmDelete) {
      deleteTrip({
        variables: { id: state.trip.id },

        update: cache => {
          try {
            const data = cache.readQuery<{ trips: Trip[] }>({ query: TRIPS_QUERY });
            const trips = data?.trips.filter(({ id: itemId }) => itemId !== id);
            cache.writeQuery({ query: TRIPS_QUERY, data: { trips } });
          } catch (e) {
            console.log(e, data);
          }
        },
      }).then(res => {
        if (res.data?.deleteTrip) {
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
    if (!isCreateNew && data) {
      dispatch({
        type: 'requestTripSuccess',
        trip: {
          ...data.trip,
          days: data.trip.days.map(d => {
            return { ...d, date: new Date(d.date) };
          }),
        },
      });
    }
  }, [data, id, isCreateNew]);

  useEffect(() => {
    document.addEventListener('keydown', memoizedKeydown);
    return () => {
      document.removeEventListener('keydown', memoizedKeydown);
    };
  }, [memoizedKeydown]);

  if (error) return <p>Error :(</p>;

  if (loading || createLoading || updateLoading || deleteLoading) {
    return <Spinner animation="border" variant="info" className="centered-spinner" />;
  }

  return (
    <div className="content">
      <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} show={alert.show} dismissible>
        <p>{alert.message}</p>
      </Alert>
      {displayControls()}
      {displayTotals()}
      {displayTitle()}
      {displayTripDays()}
      <Carousel
        imageUrls={state.trip.imageUrls || []}
        setUrls={(urls: string[]) => {
          dispatch({ type: 'setImgUrls', imgUrls: urls });
        }}
        inEditMode={isEditing}
        setEditingMode={(edit: boolean) => {
          if (edit) {
            dispatch({ type: 'startEditing' });
          } else {
            dispatch({ type: 'stopEditing' });
          }
        }}
      />
      <div ref={initializeGoogleMapsRef} id="map"></div>
    </div>
  );
}
