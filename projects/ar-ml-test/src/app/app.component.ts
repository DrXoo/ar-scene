import { Component, OnInit, HostListener } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { ObjectManager } from 'projects/ar-ml/src/lib/managers/object.manager';
import { ArTrackConfig } from 'projects/ar-ml/src/lib/models/ar-track.config';
import { CardExampleComponent } from './components/card-example/card-example.component';
import { ArSceneParameters } from 'projects/ar-ml/src/lib/models/ar-scene-parameters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  readonly MIN_PROBABILITY_DETECT: number = 0.8;

  private objectManager: ObjectManager;
  private video: HTMLVideoElement;
  private model: cocoSSD.ObjectDetection;

  predictions: any[];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onSceneError(error) {
    console.log(error);
  }

  async onSceneReady(sceneParameters: ArSceneParameters) {
    this.objectManager = sceneParameters.ObjectManager;
    this.video = sceneParameters.Video;

    this.model = await cocoSSD.load({ base: 'lite_mobilenet_v2' });

    console.log("Model Ready!");

    this.detect(); 
  }

  private async detect() {

    let predictions = await this.model.detect(this.video);

    predictions = predictions.filter(x => x.score > this.MIN_PROBABILITY_DETECT);
    if (predictions.length > 0) {
      predictions.forEach(element => {
        this.objectManager.manageUIObjects(CardExampleComponent,
          <ArTrackConfig>{
            x: element.bbox[0],
            y: element.bbox[1] + element.bbox[3]/2,
            width: this.video.clientWidth,
            height: this.video.clientHeight,
            key: element.class
          })
      });
    }

    requestAnimationFrame(() => this.detect());
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: any, targetElement: HTMLElement): void {
    this.objectManager.manageUIObjects(CardExampleComponent,
      <ArTrackConfig>{
        x: event.layerX,
        y: event.layerY,
        width: this.video.clientWidth,
        height: this.video.clientHeight,
        key: 'test'
      })
  }
}
