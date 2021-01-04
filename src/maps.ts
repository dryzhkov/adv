import { Loader } from '@googlemaps/js-api-loader';

const additionalOptions = {};
const loader = new Loader({
  apiKey: 'AIzaSyDe2AykxHZ3QlbJVA9iaWuUisPmc6J5wqw',
  version: 'weekly',
  ...additionalOptions,
});

let map: google.maps.Map;
let directionsService: google.maps.DirectionsService;
let directionsRenderer: google.maps.DirectionsRenderer;
let currentRoute: Route;

interface Route {
  to: string;
  from: string;
}

const waypoints: google.maps.DirectionsWaypoint[] = [];

const initializeMaps = (htmlElement: HTMLElement) => {
  return loader
    .load()
    .then(() => {
      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer({ draggable: true });
      const seattle: google.maps.LatLngLiteral = { lat: 47.6062, lng: -122.3321 };

      // directionsRenderer.addListener('directions_changed', () => {
      //   computeTotalDistance(directionsRenderer.getDirections());
      // });

      map = new google.maps.Map(htmlElement, {
        center: seattle,
        zoom: 8,
      });

      map.addListener('click', r => {
        waypoints.push({ location: r.latLng, stopover: true });

        calculateRoute(currentRoute);
      });

      directionsRenderer.setMap(map);
    })
    .catch(e => console.log(e));
};

// function computeTotalDistance(result: google.maps.DirectionsResult) {
//   let total = 0;
//   const myroute = result.routes[0];

//   for (let i = 0; i < myroute.legs.length; i++) {
//     total += myroute.legs[i].distance.value;
//   }
//   total = total / 1000;
//   console.log('total distance: ' + total + ' km');
// }

function calculateRoute(route: Route) {
  currentRoute = route;
  const request: google.maps.DirectionsRequest = {
    origin: route.from,
    destination: route.to,
    travelMode: google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: true,
    optimizeWaypoints: false,
    avoidHighways: false,
    waypoints: waypoints,
  };

  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    }
  });
}

function generateKML() {
  const directions = directionsRenderer.getDirections();
  const route = directions.routes[0];
  const steps: google.maps.DirectionsStep[] = [];
  const points = new Map<string, string>();
  route.legs.forEach(leg => {
    points.set(leg.start_address, `${leg.start_location.lng()},${leg.start_location.lat()},0`);
    points.set(leg.end_address, `${leg.end_location.lng()},${leg.end_location.lat()},0`);
    steps.push(...leg.steps);
  });

  let placemarks = `<Placemark>
    <name>${route.copyrights}</name>
      <LineString>
        <coordinates>${steps
      .map(step =>
        step.path
          .map(p => {
            return `\n          ${p.lng()},${p.lat()},0`;
          })
          .join('')
      )
      .join('')}
        </coordinates>
    </LineString>
  </Placemark>`;

  points.forEach((value, key) => {
    placemarks += `\n
  <Placemark>
    <name>${key}</name>
    <Point>
      <coordinates>
        ${value}
      </coordinates>
    </Point>
  </Placemark>`;
  });

  const kmlDocument = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${placemarks}
  </Document>
</kml>`;

  download(kmlDocument, `${route.legs[0].start_address.toLowerCase()}.kml`, '');
}

function download(data: BlobPart, filename: string, type: string) {
  const file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    const a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export { calculateRoute, initializeMaps, generateKML };
