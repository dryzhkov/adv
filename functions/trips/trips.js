require('dotenv').config();
const { MongoClient } = require('mongodb');
const { MONGODB_USER, MONGODB_PSWD, MONGODB_NAME, MONGODB_URI } = process.env;
const mongoURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PSWD}@${MONGODB_URI}/${MONGODB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(mongoURI, { useNewUrlParser: true });

exports.handler = function (event, context, callback) {
    client.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }
        const collection = client.db('motolog').collection('trips');
        collection.find().toArray((err, result) => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(result),
            });
            client.close();
        });
    });
};
