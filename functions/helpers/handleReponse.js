export function handleResponse(cb, result, err) {
    if (err) {
        console.log(err);
        cb(null, {
            statusCode: 400,
            body: JSON.stringify(err),
        });
    } else {
        let body = result;
        if (
            (Array.isArray(body) &&
                body.length > 0 &&
                body[0]._id !== undefined) ||
            (typeof body === 'object' && body._id !== undefined)
        ) {
            body = mapToClientSchema(body);
        }
        cb(null, {
            statusCode: 200,
            body: JSON.stringify(body),
        });
    }
}

function mapToClientSchema(response) {
    if (Array.isArray(response)) {
        return response.map((t) => {
            t.id = t._id;
            delete t._id;
            return t;
        });
    } else {
        response.id = response._id;
        delete response._id;
        return response;
    }
}
