import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import { CommonModule } from '@angular/common'
import { SceneService } from './services/scene.service';
import { CameraService } from './services/camera.service';
import {MatCardModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import { ArUiDirectiveComponent } from './directives/ar-ui-directive/ar-ui-directive.component';


@NgModule({
  declarations: [ArMlComponent, ArUiDirectiveComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    ArMlComponent,
    MatCardModule,
    MatButtonModule
  ],
  providers:[
    SceneService,
    CameraService 
  ]
})
export class ArMlModule { }
