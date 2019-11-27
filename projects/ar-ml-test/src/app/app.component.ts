import { Component, OnInit, HostListener } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { ObjectManager } from 'projects/ar-ml/src/lib/managers/object.manager';
import { ObjectNotificationService } from 'projects/ar-ml/src/lib/services/object-notification.service';
import { ArTrackConfig } from 'projects/ar-ml/src/lib/models/ar-track.config';
import { CardExampleComponent } from './components/card-example/card-example.component';

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

  constructor(private objectNotificationService: ObjectNotificationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.objectNotificationService.onRemoveObject.subscribe((id: string) => {
      this.objectManager.removeUIObject(id);
    });
  }

  onSceneError(error) {
    console.log(error);
  }

  async onSceneReady(sceneParameters: any) {
    this.objectManager = sceneParameters.ObjectManager;
    this.video = sceneParameters.Video;

    // this.objectManager.addUIObject(CardExampleComponent,
    //   {
    //     position: PositionType.ABSOLUTE,
    //     anchor: AnchorType.TOP,
    //     updateDelegate: (x: UIObject) => { },
    //     cssText: "width: 80%;"
    //   });

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
    // console.log("Click!");
    // this.objectManager.manageUIObjects(CardExampleComponent,
    //   <ArTrackConfig>{
    //     x: event.layerX,
    //     y: event.layerY,
    //     width: this.video.clientWidth,
    //     height: this.video.clientHeight,
    //     key: 'pepa'
    //   })
  }
}
