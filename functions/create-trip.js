import { createMongoClient } from './db/mongo';
import { handleResponse } from './helpers/handleReponse';

exports.handler = function (event, context, callback) {
    const body = JSON.parse(event.body);
    if (!body) {
        return callback(null, {
            statusCode: 400,
            body: 'request body required',
        });
    }

    const client = createMongoClient();
    client.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }
        const collection = client.db('motolog').collection('trips');
        collection.insertOne(body, (err, result) => {
            handleResponse(callback, result, err);
            client.close();
        });
    });
};
