export class Map {
  constructor(coords) {
    // this.coordinates = coords;
    this.render(coords);
  }

  render(coordinates) {
    if (!google) {
      alert("could not load maps");
      return;
    }

    // google --> global var; maps package and Map() constructor pass
    // DOM element which you need to be renderer by Map().
    const map = new google.maps.Map(document.getElementById("map"), {
      center: coordinates,
      zoom: 16,
    });

    // marker (configure: where to place that marker and how it should lool like)
    new google.maps.Marker({
      position: coordinates,
      // this marker should be place on above map variable
      map: map,
    });
  }
}
