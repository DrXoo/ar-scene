import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, HostListener, ComponentFactoryResolver } from '@angular/core';
import { CameraService } from './services/camera.service';
import { SceneService } from './services/scene.service';
import { SceneObjectDirective } from './directives/scene-object.directive';
import { SceneObjectConfig } from './models/scene-object-config';


@Component({
  selector: 'ar-ml',
  templateUrl: './ar-ml.component.html',
  styleUrls: ['./ar-ml.component.css']
})
export class ArMlComponent implements OnInit {

  @ViewChild( SceneObjectDirective, {static: true}) private sceneObjectHost: SceneObjectDirective;
  @ViewChild("container", {static: true})  private container: ElementRef;
  @ViewChild("videoElement", {static: true}) private video: ElementRef;

  @Output() onError: EventEmitter<string> = new EventEmitter();
  @Output() onAddSceneObject: EventEmitter<SceneObjectConfig> = new EventEmitter<SceneObjectConfig>();
  @Output() onSceneReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  deviceReady: any;

  constructor(
    private cameraService: CameraService,
    private sceneService: SceneService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }
 
  ngOnInit() {
  }

  ngAfterViewInit(){
    this.cameraService.loadFromUserCamera()
    .catch( error => {
      console.log("Error: "+error);
      this.deviceReady = false;
    })
    .then( result => {
      if(result){
        this.video.nativeElement.srcObject = result;
        (<HTMLVideoElement>this.video.nativeElement).play();
        this.deviceReady = true;
      }
    });

    (<HTMLVideoElement>this.video.nativeElement).addEventListener("play", x => {
      this.startScene();
    })

    this.onAddSceneObject.subscribe((result : SceneObjectConfig) => {
      this.addSceneObject(result);
    });
  }

  private addSceneObject(sceneObjectConfig: SceneObjectConfig){

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(sceneObjectConfig.component);

    const viewContainerRef = this.sceneObjectHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent(componentFactory);
    //(<SceneObjectComponent>componentRef.instance).data = result.data;

    this.sceneService.addUIElement(componentRef.location, sceneObjectConfig.position, sceneObjectConfig.anchor);
  }

  private async startScene(){

    await this.delay(1000); 
    
    const video: HTMLVideoElement = this.video.nativeElement;
    video

    this.sceneService.createScene(this.container, video.clientWidth, video.clientHeight);
    this.sceneService.AddSampleBoxToScene();
    this.onSceneReady.emit(true);
    this.sceneService.update();
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: any, targetElement: HTMLElement): void {
      const video: HTMLVideoElement = this.video.nativeElement;
      let x = ( event.layerX / video.clientWidth ) * 2 - 1;
      let y = - ( event.layerY / video.clientHeight ) * 2 + 1;
      this.sceneService.launchRay(x, y);
  }

}
