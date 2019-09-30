import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

  deviceNotReady: boolean = false;

  private camera : CameraController = new CameraController();
  private sceneManager : SceneManager = new SceneManager();

  constructor() { }
 
  ngOnInit() {
  }

  ngAfterViewInit(){
    if(this.camera.canAccessCamera()){
      this.camera.start(this.videoElement.nativeElement);
      this.sceneManager.createScene(this.canvasElement.nativeElement);
    }else{
      this.deviceNotReady = true;
    }
  }

}
