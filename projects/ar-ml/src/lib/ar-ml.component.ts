import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CameraService } from './services/camera.service';
import { SceneService } from './services/scene.service';


@Component({
  selector: 'ar-ml',
  templateUrl: './ar-ml.component.html',
  styleUrls: ['./ar-ml.component.css']
})
export class ArMlComponent implements OnInit {

  @ViewChild("videoElement", {static: true})
  public videoElement: ElementRef;

  @ViewChild("canvasElement", {static: true})
  public canvasElement: ElementRef;

  @Output() onError: EventEmitter<string> = new EventEmitter();

  deviceReady: any;

  constructor(
    private cameraService: CameraService,
    private sceneService: SceneService
  ) { }
 
  ngOnInit() {
  }

  ngAfterViewInit(){
    if(this.cameraService.canAccessCamera()){
      this.deviceReady = true;

      this.cameraService.start(this.videoElement.nativeElement);
    }
    else{
      this.deviceReady = false;
    }
  }

  async startScene(){

    await this.delay(1000); 
    
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    this.sceneService.createScene(this.canvasElement.nativeElement,
      video.clientWidth,
      video.clientHeight );
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
