import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CardExampleComponent } from './components/card-example/card-example.component';
import { UIObject } from 'projects/ar-ml/src/lib/models/uiObject';
import { PositionType } from 'projects/ar-ml/src/lib/enums/position-enum';
import { AnchorType } from 'projects/ar-ml/src/lib/enums/anchor-enum';
import { ObjectManager } from 'projects/ar-ml/src/lib/managers/object.manager';
import { ObjectNotificationService } from 'projects/ar-ml/src/lib/services/object-notification.service';
import { Vector2 } from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private objectManager: ObjectManager;
  private video: HTMLVideoElement;
  private mousePosition: Vector2 = new Vector2();

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

  onSceneReady(sceneParameters: any) {
    console.log(sceneParameters);
    this.objectManager = sceneParameters.ObjectManager;
    this.video = sceneParameters.Video;

    this.objectManager.addUIObject(CardExampleComponent,
      {
        position: PositionType.ABSOLUTE,
        anchor: AnchorType.TOP,
        updateDelegate: (x: UIObject) => {  },
        cssText: "width: 40%;"
      });

    this.objectManager.addUIObject(CardExampleComponent,
      {
        position: PositionType.ABSOLUTE,
        anchor: AnchorType.BOTTOM,
        updateDelegate: (x: UIObject) => {  },
        cssText: "width: 60%;"
      });
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: any, targetElement: HTMLElement): void {
    this.mousePosition.set(event.layerX, -event.layerY);
  }
}
