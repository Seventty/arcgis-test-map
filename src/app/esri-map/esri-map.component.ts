import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import Map from "@arcgis/core/Map";
import MapConfig from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView"
import BaseMapToggle from "@arcgis/core/widgets/BasemapToggle";
import BaseMapGallery from "@arcgis/core/widgets/BasemapGallery";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as MapLocator from "@arcgis/core/rest/locator"
import Layer from "@arcgis/core/layers/Layer";
import Editor from "@arcgis/core/widgets/Editor"
import Expand from "@arcgis/core/widgets/Expand";
import Sketch from '@arcgis/core/widgets/Sketch';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import WebMap from "@arcgis/core/WebMap";

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
  @ViewChild('editorDiv', { static: true }) private editorDivElement: ElementRef | any;

  // ---> Properties to configure ARCgis by Esri <--- //
  /**
   * @private _apikey sets the api key to connect with api
   * @private _locatorUrl sets the url to get the name of the reverse geolocalitation (geolocalitation event popup)
  ** private variables bellow is from default (not assignable, just mockup variable)
  **/
  private _apiKey: string = "AAPK79e2816fd7f441be8092728e7bf6b990a4gRX-f5I8ijkfAqIHNtkx3iUXXEHiGf5W9HQhxD_Vw0QeZ85oFnvwge0yC6w_9y";
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
  private polygonLayer: any;
  private lineLayer: any;
  private pointLayer: any;

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

  constructor() {

  }

  async initializeMap() {
    try {
      MapConfig.apiKey = this._apiKey;

      /* const polygonLayer = new FeatureLayer({
        portalItem: {
          "id": "cdf3565a90994e379e57be9b03aeabc8"
        }
      });

      const lineLayer = new FeatureLayer({
        portalItem: {
          "id": "a591386b9efa416b88806d0af8105f67"
        }
      });

      const pointLayer = new FeatureLayer({
        portalItem: {
          "id": "aabe37254f7e47ce9c8301a35b49a67c"
        }
      }); */

      const map: Map = new Map({
        basemap: this._basemap,
        /* layers: [polygonLayer, lineLayer, pointLayer] */
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      /* const webMap: WebMap = new WebMap({
        portalItem: {
          id: "ed86382ac69b44ed8fe06eca8d4a4475"
        }
      }); */


      const view = new MapView({
        map: map,
        center: this._center,
        zoom: this._zoom,
        container: this.mapViewElement.nativeElement,
        popup: {
          dockEnabled: true,
          dockOptions: {
            position: "top-center",
            breakpoint: false,
            buttonEnabled: false
          }
        }
      });

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

      const bgExpand = new Expand({
        view: view,
        content: basemapGallery
      });

      const editor = new Editor({
        view: view,
      });


      view.ui.add(bgExpand, "bottom-right");
      view.ui.add(basemapToggle, "bottom-left");
      view.ui.add(editor, "top-right");

      // Running the map
      view.when(() => {
        view.whenLayerView(graphicsLayer).then((value) => {
          console.log(value)
        })
      });

    } catch (error) {
      alert('We have an error: ' + error);
    }

  }

  ngOnInit() {
    this.initializeMap();
  }
}
