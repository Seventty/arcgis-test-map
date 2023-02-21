import { Component } from '@angular/core';
import { BasemapType } from './esri-map/BasemapType.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mapCenter: Array<number> = [-69.933491, 18.477923];
  mapZoomLevel: number = 8;
  baseMapType: BasemapType = BasemapType.TopoVector;
  nextBaseMapType: BasemapType = BasemapType.Satellite;
  polygonRings: Array<number>[] = [
    [-69.898117, 18.476076],
    [-69.899118, 18.475731],
    [-69.899382, 18.476417],
    [-69.897563, 18.477374],
    [-69.896892, 18.476687]
  ]

  mapLoadedEvent(status: boolean) {
    console.log('The map has loaded: ' + status);
  }

}
