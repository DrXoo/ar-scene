import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import { CommonModule } from '@angular/common'
import { CameraService } from './services/camera.service';
import { MatCardModule} from '@angular/material';
import { MatButtonModule} from '@angular/material/button';
import { SceneObjectDirective } from './directives/scene-object.directive';


@NgModule({
  declarations: [ArMlComponent, SceneObjectDirective],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    ArMlComponent,
    MatCardModule, 
    MatButtonModule,
  ],
  providers:[
    CameraService 
  ]
})
export class ArMlModule { 
}
