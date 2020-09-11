import { createMongoClient } from './db/mongo';
import { getId } from './helpers/getId';
import { handleResponse } from './helpers/handleReponse';

exports.handler = function (event, context, callback) {
    const id = Number(getId(event.path));
    if (isNaN(id)) {
        return callback(null, {
            statusCode: 400,
            body: 'invalid id: ' + id,
        });
    }
    const body = JSON.parse(event.body);
    delete body._id;
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
        const filter = {
            id,
        };
        collection.updateOne(filter, { $set: body }, (err, result) => {
            handleResponse(callback, result, err);
            client.close();
        });
    });
};
