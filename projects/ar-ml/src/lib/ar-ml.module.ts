import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import { CommonModule } from '@angular/common'
import { CameraService } from './services/camera.service';
import { MatCardModule, MatIconModule} from '@angular/material';
import { MatButtonModule} from '@angular/material/button';
import { SceneObjectDirective } from './directives/scene-object.directive';
import { ArBaseComponent } from './components/ar-base/ar-base.component';


@NgModule({
  declarations: [ArMlComponent, SceneObjectDirective, ArBaseComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    ArMlComponent,
    MatCardModule, 
    MatButtonModule,
    MatIconModule
  ],
  entryComponents:[
    ArBaseComponent
  ]
})
export class ArMlModule { 
}
