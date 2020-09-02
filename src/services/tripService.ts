export function getTrips() {
    return fetch(`${process.env.REACT_APP_ADV_API_BASE}/trips`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return [];
        })
        .catch((ex) => {
            console.log('unable to fetch trips: ' + ex);
            return [];
        });
}
