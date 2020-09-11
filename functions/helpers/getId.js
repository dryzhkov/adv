import { ObjectId } from 'mongodb';

export function getId(urlPath) {
    return urlPath.match(/([^\/]*)\/*$/)[0];
}

export function idFilter(id) {
    return {
        _id: ObjectId(id),
    };
}
