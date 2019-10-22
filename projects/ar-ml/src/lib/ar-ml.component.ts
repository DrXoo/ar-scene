import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CameraController } from './controllers/camera.controller';
import { SceneManager } from './managers/scene.manager';


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

  private camera : CameraController = new CameraController();
  private sceneManager : SceneManager = new SceneManager();

  constructor() { }
 
  ngOnInit() {
  }

  ngAfterViewInit(){
    if(this.camera.canAccessCamera()){
      this.deviceReady = true;

      this.camera.start(this.videoElement.nativeElement);
    }
    else{
      this.deviceReady = false;
    }
  }

  async startScene(){

    await this.delay(1000); 
    
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    this.sceneManager.createScene(this.canvasElement.nativeElement,
      video.clientWidth,
      video.clientHeight );
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
