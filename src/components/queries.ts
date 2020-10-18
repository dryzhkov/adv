import { gql } from '@apollo/client';

export const TRIPS_QUERY = gql`
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

export const GET_TRIP_BY_ID_QUERY = gql`
  query GetTripById($id: ID!) {
    trip(id: $id) {
      id
      title
      imageUrls
      days {
        date
        from
        to
        distance
        hours
        directions
      }
    }
  }
`;

export const CREATE_TRIP = gql`
  mutation createTrip($input: InputTrip!) {
    createTrip(input: $input) {
      id
    }
  }
`;

export const UPDATE_TRIP = gql`
  mutation updateTrip($id: ID!, $input: InputTrip!) {
    updateTrip(id: $id, input: $input)
  }
`;

export const DELETE_TRIP = gql`
  mutation deleteTrip($id: ID!) {
    deleteTrip(id: $id)
  }
`;