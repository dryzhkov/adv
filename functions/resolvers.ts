import { GraphQLScalarType } from 'graphql';
import { idFilter } from './helpers/getId';

export const resolvers = {
    Query: {
        trips(_, _args, _context, _info) {
            return _context.db.collection('trips').find().toArray();
        },
        trip(_, _args, _context, _info) {
            return _context.db.collection('trips').findOne(idFilter(_args.id));
        },
    },

    Mutation: {
        async createTrip(_, _args, _context, _info) {
            const result = await _context.db.collection('trips').insertOne(_args.input);
            return { ...result.ops[0], id: result.ops[0]._id};
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