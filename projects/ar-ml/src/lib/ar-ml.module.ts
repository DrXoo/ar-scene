import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import { CommonModule } from '@angular/common'
import { SceneService } from './services/scene.service';
import { CameraService } from './services/camera.service';
import { MatCardModule} from '@angular/material';
import { MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [ArMlComponent],
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
