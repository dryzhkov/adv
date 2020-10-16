
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-lambda';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';

import { createMongoClient } from './db/mongo';
import { resolvers } from './resolvers'; 

const typeDefs = gql`
    input InputTrip {
        title: String!
        days: [InputTripDay!]
        imageUrls: [String]
    }

    input InputTripDay {
        date: DateTime
        from: String
        to: String
        distance: Float
        hours: Float
        directions: String
    }

    scalar DateTime

    type Trip @entity {
        id: ID! @id
        title: String!
        days: [TripDay!]
        imageUrls: [String]
    }

    type TripDay {
        date: DateTime
        from: String
        to: String
        distance: Float
        hours: Float
        directions: String
    }

    type Query {
        trips: [Trip]
        trip(id: ID!): Trip
    }

    type Mutation {
        createTrip(input: InputTrip!): Trip!
        updateTrip(id: ID!, input: InputTrip!): Boolean
        deleteTrip(id: ID!): Boolean
    }
`;



let db;
const schema = makeExecutableSchema({ typeDefs: [DIRECTIVES, typeDefs], resolvers });

const server = new ApolloServer({
    schema,
    context: async () => {
        if (!db) {
            const mogno = createMongoClient();
            if (!mogno.isConnected()) await mogno.connect();
            db = mogno.db('motolog'); // database name
        }

        return { db };
    },
});

exports.handler = server.createHandler();
