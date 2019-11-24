import { Component, OnInit } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { ObjectManager } from 'projects/ar-ml/src/lib/managers/object.manager';
import { ObjectNotificationService } from 'projects/ar-ml/src/lib/services/object-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  readonly FRAME_INTERVAL_DETECT : number = 15;
  readonly MIN_PROBABILITY_DETECT : number = 0.8;

  private objectManager: ObjectManager;
  private video: HTMLVideoElement;
  private model: cocoSSD.ObjectDetection;

  predictions: any[];
  frameCount : number = 0;


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

    // this.objectManager.addUIObject(CardExampleComponent,
    //   {
    //     position: PositionType.ABSOLUTE,
    //     anchor: AnchorType.BOTTOM,
    //     updateDelegate: (x: UIObject) => { },
    //     cssText: "width: 60%;"
    //   });

    this.model = await cocoSSD.load({base : 'lite_mobilenet_v2'});

    this.detect();
  }

  private detect() {
    if(this.frameCount == this.FRAME_INTERVAL_DETECT){
      this.model.detect(this.video).then(predictions => {
        predictions = predictions.filter(x => x.score > this.MIN_PROBABILITY_DETECT);
        if(predictions.length > 0){
          predictions.forEach(element => {
            this.objectManager.manageArPointers(element.class, element.bbox[0], element.bbox[1], this.video.clientWidth, this.video.clientHeight);
          });
        }
      }, (error) => {
        console.error(error);
      });
      this.frameCount = 0;
    }

    this.frameCount++;

    requestAnimationFrame(() => this.detect());
  }
}
