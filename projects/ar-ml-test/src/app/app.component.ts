import { Component, OnInit, ElementRef } from '@angular/core';
import { CardExampleComponent } from './components/card-example/card-example.component';
import { SceneObjectConfig } from 'projects/ar-ml/src/lib/models/scene-object-config';
import { UIObject } from 'projects/ar-ml/src/lib/models/uiObject';
import { PositionType } from 'projects/ar-ml/src/lib/enums/position-enum';
import { AnchorType } from 'projects/ar-ml/src/lib/enums/anchor-enum';
import { ObjectManager } from 'projects/ar-ml/src/lib/managers/object.manager';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private objectManager : ObjectManager;
  private video : HTMLVideoElement;

  constructor(){

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
  }

  onSceneError(){

  }

  onSceneReady(sceneParameters : any){
    console.log(sceneParameters);
    this.objectManager = sceneParameters.ObjectManager;
    this.video = sceneParameters.Video;
 
    this.objectManager.addUIObject(CardExampleComponent, new SceneObjectConfig(PositionType.ABSOLUTE, AnchorType.TOP, (x : UIObject) => {x.rotation.x += 0.01}));
    this.objectManager.addUIObject(CardExampleComponent, new SceneObjectConfig(PositionType.ABSOLUTE, AnchorType.BOTTOM, (x : UIObject) => {x.rotation.y += 0.01}));
  }
}
