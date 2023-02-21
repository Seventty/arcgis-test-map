import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import Map from "@arcgis/core/Map";
import MapConfig from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView"
import BaseMapToggle from "@arcgis/core/widgets/BasemapToggle";
import BaseMapGallery from "@arcgis/core/widgets/BasemapGallery";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as MapLocator from "@arcgis/core/rest/locator"

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent implements OnInit {
  /* ---> Emit if map is loaded correctly or not <--- */
  @Output() mapLoaded = new EventEmitter<boolean>(false);

  /* This inyect the map into a Div tag
    The ViewChild selector (first param) is the className or Class of the Div */
  @ViewChild('mapViewNode', { static: true }) private mapViewElement: ElementRef | any;

  // ---> Properties to configure ARCgis by Esri <--- //
  /**
   * @private _apikey sets the api key to connect with api
   * @private _locatorUrl sets the url to get the name of the reverse geolocalitation (geolocalitation event popup)
  ** private variables bellow is from default (not assignable, just mockup variable)
  **/
  private _apiKey: string = "AAPKd15f534ac53c4706a5e23dd88bf2e369bXNvUjzN7DY6BoQuRBCJgpb7jJuvMViu9SOelgdz2cyWNQndT0dQyDIrNWBqfUpG";
  private _locatorUrl: string = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  // ---> Properties to use in map layer <--- //
  /**
   * @private _zoom sets map zoom
   * @private _center sets map center
   * @private _basemap sets type of map to show
   * @private _nextbasemap sets the next layer in the basemap widget
   * @private _polygonRings Is an array to set the points of polygon
  ** private variables bellow is from default (not assignable, just mockup variable)
  */
  private _zoom: number = 0;
  private _center: Array<number> = [];
  private _basemap: string = "streets";
  private _nextbasemap: string = "satellite";
  private _polygonRings: Array<number>[] = [];

  // ----->> Initial Zoom Get/Set <<----- //
  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  // ----->> Initial Coordinates Get/Set <<----- //
  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  // ----->> Default BaseMap Layer Style Get/Set <<----- //
  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  // ----->> Next BaseMap Layer Style Get/Set <<----- //
  @Input()
  set nextBaseMap(nextBaseMap: string) {
    this._nextbasemap = nextBaseMap;
  }

  get nextBaseMap(): string {
    return this._nextbasemap;
  }

  // ----->> Polygon rings cordinates to draw a polygon Get/Set <<----- //
  @Input()
  set polygonRings(polygonRings: Array<number>[]) {
    this._polygonRings = polygonRings;
  }

  get polygonRings(): Array<number>[] {
    return this._polygonRings;
  }

  constructor() {

  }

  async initializeMap() {
    try {
      MapConfig.apiKey = this._apiKey;

      const map: Map = new Map({
        basemap: this._basemap
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const view = new MapView({
        map: map,
        center: this._center,
        zoom: this._zoom,
        container: this.mapViewElement.nativeElement
      });

      const point: any = { //Create a point
        type: "point",
        longitude: -69.898117,
        latitude: 18.476076
      };

      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1
        }
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });
      graphicsLayer.add(pointGraphic);

      // Create a polygon geometry
      const polygon: any = {
        type: "polygon",
        rings: this._polygonRings
      };

      const simpleFillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8],  // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      };

      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      graphicsLayer.add(polygonGraphic);

      const basemapToggle = new BaseMapToggle({
        view: view,
        nextBasemap: this._nextbasemap,
      });

      const basemapGallery = new BaseMapGallery({
        view: view,
        source: {
          query: {
            title: '"World Basemaps for Developers" AND owner:esri'
          }
        }
      });

      view.ui.add(basemapGallery, "bottom-right");
      view.ui.add(basemapToggle, "top-right");

      view.popup.autoOpenEnabled = false;

      view.on("click", (event) => {
        // Get the coordinates of the click on the view
        // around the decimals to 3 decimals
        const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
        const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
        const params = {
          location: event.mapPoint
        };

        view.popup.open({
          // Set the popup's title to the coordinates of the clicked location
          title: `Coordenadas de Geolocalización \n\nLongitud: ${lon}\nLatitud: ${lat}`,
          location: event.mapPoint // Set the location of the popup to the clicked location
        });

        MapLocator.locationToAddress(this._locatorUrl, params).then((response) => {
          view.popup.content = response.address;
        }).catch(() => {
          view.popup.content = "No he encontrado una dirección para esta localización"
        })

      });

      // Running the map
      view.when(() => {
        this.mapLoaded.emit(true)
      })

    } catch (error) {
      alert('We have an error: ' + error);
    }

  }

  ngOnInit() {
    this.initializeMap();
  }
}
