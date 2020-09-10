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
        collection.findOne(filter, (err, result) => {
            handleResponse(callback, result, err);
            client.close();
        });
    });
};
