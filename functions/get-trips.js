import { createMongoClient } from './db/mongo';
import { handleResponse } from './helpers/handleReponse';

exports.handler = function (event, context, callback) {
    const client = createMongoClient();
    client.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }
        const collection = client.db('motolog').collection('trips');
        collection.find().toArray((err, result) => {
            handleResponse(callback, result, err);
            client.close();
        });
    });
};
