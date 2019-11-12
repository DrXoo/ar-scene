import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { CameraService } from './services/camera.service';
import { SceneService } from './services/scene.service';
import { PositionType } from './enums/position-enum';
import { AnchorType } from './enums/anchor-enum';


@Component({
  selector: 'ar-ml',
  templateUrl: './ar-ml.component.html',
  styleUrls: ['./ar-ml.component.css']
})
export class ArMlComponent implements OnInit {

  @ViewChild("container", {static: true})
  public containerElement: ElementRef;

  @ViewChild("contentHost", {static: true})
  public contentHost: ElementRef;

  @ViewChild("canvasElement", {static: true})
  public canvasElement: ElementRef;

  @ViewChild("videoElement", {static: true})
  public videoElement: ElementRef;

  @Output() onError: EventEmitter<string> = new EventEmitter();

  deviceReady: any;

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
        this.videoElement.nativeElement.srcObject = result;
        this.videoElement.nativeElement.play();
        this.deviceReady = true;
      }
    })
  }

  async startScene(){

    await this.delay(1000); 
    
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    this.sceneService.createScene(this.containerElement, video.clientWidth, video.clientHeight);
    this.sceneService.AddSampleBoxToScene();
    this.sceneService.addUIElement(this.contentHost, PositionType.ABSOLUTE, AnchorType.LEFT);  
    this.sceneService.update();
    

    // this.sceneService.update();
  }

  public clickEvent(event: any){
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    console.log(event);
    let x = ( event.layerX / video.clientWidth ) * 2 - 1;
    let y = - ( event.layerY / video.clientHeight ) * 2 + 1;
    
    this.sceneService.launchRay(x, y);
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: any, targetElement: HTMLElement): void {
      console.log(event);
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      let x = ( event.layerX / video.clientWidth ) * 2 - 1;
      let y = - ( event.layerY / video.clientHeight ) * 2 + 1;
      this.sceneService.launchRay(x, y);
  }

}
