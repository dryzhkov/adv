import { createMongoClient } from './db/mongo';
import { getId, idFilter } from './helpers/getId';
import { handleResponse } from './helpers/handleReponse';

exports.handler = function (event, context, callback) {
    const id = getId(event.path);
    if (!id) {
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
        collection.deleteOne(idFilter(id), (err, result) => {
            handleResponse(callback, result, err);
            client.close();
        });
    });
};
