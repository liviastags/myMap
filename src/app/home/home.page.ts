import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap: string = 'topo-vector'; // Default basemap

  constructor() { }

  async ngOnInit() {
    const map = new Map({
      basemap: this.selectedBasemap
    });

    this.mapView = new MapView({
      container: 'container',
      map: map,
      zoom: 4
    });

    // Add weather service layer
    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    // Add marker layer after weather service layer
    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);

    // Add a specific marker
    this.addMarkerAtSpecificLocation();
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol({
          color: [226, 119, 40], // Orange color
          size: 8,
          outline: {
            color: [255, 255, 255], // White color
            width: 1
          }
        }),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  addMarkerAtSpecificLocation() {
    
    // Define the specific location for the marker
    const lat = 42.259791484677386;
    const lng =  -71.38451293076186; 

     
    // Create Point geometry for the marker
    const markerPoint = new Point({
      latitude: lat,
      longitude: lng
    });

    const markerSymbol = new SimpleMarkerSymbol({
      color: [0, 0, 255], // Blue color
      size: 12,
      outline: {
        color: [255, 255, 255], // White color
        width: 2
      }
    });

    const markerGraphic = new Graphic({
      geometry: markerPoint,
      symbol: markerSymbol
    });

    // Add the marker to the map view
    this.mapView.graphics.add(markerGraphic);
  }

  changeBasemap() {
    if (this.mapView && this.selectedBasemap) {
      this.mapView.map.basemap = this.selectedBasemap;
    }
  }
}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

// private latitude: number | any;
// private longitude: number | any;
//   const position = await Geolocation.getCurrentPosition();
//   this.longitude = position.coords.longitude;
//   this.latitude = position.coords.latitude;

//   // this.longitude = 106.87844308161512;
//   // this.latitude = -6.194248327586573;

//   const markerSymbol = {
//     type: "simple-marker",
//     color: "blue",  // Warna marker
//     outline: {
//       color: "white", // Warna outline marker
//       width: 1
//     }
//   };

//   // Create Point geometry for the marker
//   const point = new Point({
//     longitude: this.longitude,
//     latitude: this.latitude
//   });

//   // Create a graphic for the marker
//   const pointGraphic = new Graphic({
//     geometry: point, // Now using Point geometry
//     symbol: markerSymbol
//   });

//   // Add the graphic (marker) to the map view
//   view.graphics.add(pointGraphic);
