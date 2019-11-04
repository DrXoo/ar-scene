import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import { CommonModule } from '@angular/common'
import { SceneService } from './services/scene.service';
import { CameraService } from './services/camera.service';
import {MatCardModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import { TestComponent } from './components/test/test.component';


@NgModule({
  declarations: [ArMlComponent, TestComponent],
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
