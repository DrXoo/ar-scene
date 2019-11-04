import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CameraService } from './services/camera.service';
import { SceneService } from './services/scene.service';


@Component({
  selector: 'ar-ml',
  templateUrl: './ar-ml.component.html',
  styleUrls: ['./ar-ml.component.css']
})
export class ArMlComponent implements OnInit {

  @ViewChild("container", {static: true})
  public containerElement: ElementRef;

  @ViewChild("test", {static: true})
  public test: ElementRef;

  @ViewChild("videoElement", {static: true})
  public videoElement: ElementRef;

  @Output() onError: EventEmitter<string> = new EventEmitter();

  deviceReady: any;

  content = '<lib-test></lib-test>';

  constructor(
    private cameraService: CameraService,
    private sceneService: SceneService
  ) { }
 
  ngOnInit() {
  }

  ngAfterViewInit(){
    this.cameraService.loadFromUserCamera().catch(error => {
      console.log("Error: "+error);
      this.deviceReady = false;
    }).then( result => {
      if(result){
        if(result){
          this.videoElement.nativeElement.srcObject = result;
          this.videoElement.nativeElement.play();
        }
      }
    })
  }

  async startScene(){

    await this.delay(1000); 
    
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    // this.sceneService.createWebGLScene(this.canvasElement.nativeElement,
    //   video.clientWidth,
    //   video.clientHeight );

    this.sceneService.createCSS3DScene(this.containerElement, video.clientWidth, video.clientHeight);

    this.sceneService.attachDOMToCSS3DRenderer(this.test);  

    this.sceneService.update();
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
