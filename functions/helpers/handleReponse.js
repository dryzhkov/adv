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

export function mapToClientSchema(response) {
    if (Array.isArray(response)) {
        return response.map(mapToClientTrip);
    } else {
        return mapToClientTrip(response);
    }
}

function mapToClientTrip(trip) {
    const temp = trip._id;
    delete trip._id;
    
    return {
        ...trip,
        id: temp,
    }
}
