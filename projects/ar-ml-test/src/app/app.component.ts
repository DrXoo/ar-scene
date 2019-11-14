import { Component, OnInit, ViewChild } from '@angular/core';
import { ArMlComponent } from 'projects/ar-ml/src/public-api';
import { SceneObjectConfig } from 'projects/ar-ml/src/lib/models/scene-object-config';
import { CardExampleComponent } from './components/card-example/card-example.component';
import { PositionType } from 'projects/ar-ml/src/lib/enums/position-enum';
import { AnchorType } from 'projects/ar-ml/src/lib/enums/anchor-enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild("scene", {static: true}) armlComponent: ArMlComponent;

  constructor(){

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    this.armlComponent.onSceneReady.subscribe( (result : boolean) => {
      if(result){
        this.armlComponent.
          .emit(new SceneObjectConfig(CardExampleComponent, PositionType.ABSOLUTE, AnchorType.TOP, null));
        this.armlComponent.onAddSceneObject
          .emit(new SceneObjectConfig(CardExampleComponent, PositionType.ABSOLUTE, AnchorType.BOTTOM, null));
      }
    })
  }
}
