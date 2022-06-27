import { Map } from "./UI/Map";

class LoadedPlace {
  constructor(coordinates, address) {
    new Map(coordinates);
    const headerTitleEl = document.querySelector("header h1");
    headerTitleEl.textContent = address;
  }
}

const url = new URL(location.href);
const queryParams = url.searchParams;
// const coords = {
//   lat: +queryParams.get("lat"),
//   lng: parseFloat(queryParams.get("lng")),
// };
// const address = queryParams.get("address");
// instantiate and parse some data from URL

// using location ID to find in the back-end server
const locId = queryParams.get("location");

fetch("http://localhost:3000/location/" + locId)
  .then((response) => {
    if (response.status === 404) {
      throw new Error("Could not find location!");
    }
    return response.json();
  })
  .then((data) => {
    new LoadedPlace(data.coordinates, data.address);
  })
  .catch((err) => {
    alert(err.message);
  });

// new LoadedPlace(coords, address);
