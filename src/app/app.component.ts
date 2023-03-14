import { Component } from '@angular/core';
import { BasemapType } from './BasemapType.enum';

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
}
