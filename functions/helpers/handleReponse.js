export function handleResponse(cb, result, err) {
    if (err) {
        console.log(err);
        cb(null, {
            statusCode: 400,
            body: JSON.stringify(err),
        });
    } else {
        cb(null, {
            statusCode: 200,
            body: JSON.stringify(result),
        });
    }
}
