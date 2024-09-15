import { Component, OnInit } from '@angular/core';
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import { Geolocation } from '@capacitor/geolocation';
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  private latitude: number | any;
  private longitude: number | any;


  public async ngOnInit() {
    const position = await Geolocation.getCurrentPosition();
    this.longitude = position.coords.longitude;
    this.latitude = position.coords.latitude;

    // this.longitude = 106.87844308161512;
    // this.latitude = -6.194248327586573;

    const map = new Map({
      basemap: 'topo-vector'
    });
    const view = new MapView({
      container: 'container',
      map: map,
      zoom: 15,
      center: [this.longitude, this.latitude]
    });

    const markerSymbol = {
      type: "simple-marker",
      color: "blue",  // Warna marker
      outline: {
        color: "white", // Warna outline marker
        width: 1
      }
    };

    // Create Point geometry for the marker
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    // Create a graphic for the marker
    const pointGraphic = new Graphic({
      geometry: point, // Now using Point geometry
      symbol: markerSymbol
    });

    // Add the graphic (marker) to the map view
    view.graphics.add(pointGraphic);
  }
}