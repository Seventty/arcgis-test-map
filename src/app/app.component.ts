import { Component } from '@angular/core';
import { BasemapType } from './esri-map/enum/BasemapType.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mapCenter = [-69.933491, 18.477923];
  baseMapType = BasemapType.TopoVector;
  nextBaseMapType = BasemapType.Satellite;
  mapZoomLevel = 8;

  mapLoadedEvent(status: boolean) {
    console.log('The map has loaded: ' + status);
  }
}
