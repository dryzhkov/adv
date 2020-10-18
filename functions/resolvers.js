import { GraphQLScalarType } from 'graphql';
import { idFilter } from './helpers/getId';
import { mapToClientSchema } from './helpers/handleReponse';

export const resolvers = {
    Query: {
        async trips(_, _args, _context, _info) {
            const rawTrips = await _context.db.collection('trips').find().toArray();
            return mapToClientSchema(rawTrips);
        },
        async trip(_, _args, _context, _info) {
            const rawTrip = await _context.db.collection('trips').findOne(idFilter(_args.id));
            return mapToClientSchema(rawTrip);
        },
    },

    Mutation: {
        async createTrip(_, _args, _context, _info) {
            const result = await _context.db.collection('trips').insertOne(_args.input);
            return { ...result.ops[0], id: result.ops[0]._id};
        },
        async updateTrip(_, {id, input}, _context, _info) {
            const { result } = await _context.db.collection('trips').updateOne(idFilter(id), { $set: input });
            return result && result.ok === 1;
        },
        async deleteTrip(_, {id}, _context, _info) {
            const { result } = await _context.db.collection('trips').deleteOne(idFilter(id));
            return result && result.ok === 1;
        }
    },

    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime custom scalar type',
        parseValue(value) {
            return value;
        },
        serialize(value) {
            return new Date(value); // value sent to the client
        },
        parseLiteral(ast) {
            return new Date(ast.value);
        },
    }),
};