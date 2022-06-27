import { Modal } from "./UI/Model";
import { Map } from "./UI/Map";
import { getCoordsFromAddress, getAddressFromCoords } from "./Utility/Location";

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector("form");
    const locateUserBtn = document.getElementById("locate-btn");

    // 将share button 作为PlaceFinder 类的属性
    this.shareBtn = document.getElementById("share-btn");

    locateUserBtn.addEventListener("click", this.locateUserHandler.bind(this));
    addressForm.addEventListener("submit", this.findAddressHandler.bind(this));

    this.shareBtn.addEventListener("click", this.sharePlaceHandler);
  }

  sharePlaceHandler() {
    const sharedLinkInputElement = document.getElementById("share-link");

    // because clipboard API has weak browser support
    if (!navigator.clipboard) {
      sharedLinkInputElement.select();
      return;
    }

    // have support of clipboard api
    navigator.clipboard
      .writeText(sharedLinkInputElement.value)
      .then(alert("Copied into clipboard successfully!"))
      .catch((err) => {
        console.log(err);
        sharedLinkInputElement.select();
      });
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }

    // HERE!  --> for example to send a request to the URL
    fetch("http://localhost:3000/add-location", {
      method: "POST",
      // extracting the keys
      body: JSON.stringify({
        address: address,
        lat: coordinates.lat,
        lng: coordinates.lng,
      }),
      headers: {
        // to tell the back-end we sending some JSON data
        // in the back-end --> bodyParser.json() knows that this is a request where it should parse its body.
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // parse the JSON data (checking the status code is ok? ) --> which return a new promise
        return response.json();
      })
      .then((data) => {
        const locationId = data.locId;

        // console.log(data);
        this.shareBtn.disabled = false;
        // get the DOM input element
        const sharedLinkInputElement = document.getElementById("share-link");

        // put the link into the input element
        // encode all the data into this URL
        sharedLinkInputElement.value = `${
          location.origin
        }/my-place?location=${locationId}`;
      });

    
  }

  locateUserHandler() {
    // get the user location
    if (!navigator.geolocation) {
      alert("Location feature is not available");
      return;
    }
    const modal = new Modal("loading-modal-content", "alert text");
    modal.show();
    // Using browser API to get the current coordinates
    navigator.geolocation.getCurrentPosition(
      async (successResult) => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };
        // console.log(coordinates);
        const address = await getAddressFromCoords(coordinates);
        modal.hide();
        this.selectPlace(coordinates, address);
      },
      (error) => {
        modal.hide();
        alert("Could not locate you. Please enter an address manually");
      }
    );
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector("input").value;
    if (!address || address.trim().length === 0) {
      alert("invalid address");
      return;
    }

    const modal = new Modal("loading-modal-content", "alert text");
    modal.show();

    try {
      //get the coordinates from what users input
      const coordinates = await getCoordsFromAddress(address);

      //await for the above statement will temporarily block the following lines execute
      // below lines in the end just wrapped into an invisible .then() block

      // forward the coordinates and showing thie marker on the map
      this.selectPlace(coordinates, address);
    } catch (err) {
      alert(err.message);
    }

    modal.hide();
  }
}

const placeFinder = new PlaceFinder();
