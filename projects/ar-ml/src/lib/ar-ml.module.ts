import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import { CommonModule } from '@angular/common'
import { SceneService } from './services/scene.service';
import { CameraService } from './services/camera.service';


@NgModule({
  declarations: [ArMlComponent],
  imports: [
    CommonModule
  ],
  exports: [ArMlComponent],
  providers:[
    SceneService,
    CameraService
  ]
})
export class ArMlModule { }
