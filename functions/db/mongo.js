require('dotenv').config();
const { MongoClient } = require('mongodb');
const { MONGODB_USER, MONGODB_PSWD, MONGODB_NAME, MONGODB_URI } = process.env;
const mongoURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PSWD}@${MONGODB_URI}/${MONGODB_NAME}?retryWrites=true&w=majority`;

export function createMongoClient() {
    return new MongoClient(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
