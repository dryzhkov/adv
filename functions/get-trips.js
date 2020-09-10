import client from './db/mongo';

exports.handler = function (event, context, callback) {
    client.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(event);
        console.log(context);
        const collection = client.db('motolog').collection('trips');
        collection.find().toArray((err, result) => {
            if (err) {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify(err),
                });
            } else {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(result),
                });
            }

            client.close();
        });
    });
};
