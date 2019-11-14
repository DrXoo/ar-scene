import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, HostListener, ComponentFactoryResolver, Type } from '@angular/core';
import { CameraService } from './services/camera.service';
import { SceneService } from './services/scene.service';
import { SceneObjectDirective } from './directives/scene-object.directive';
import { SceneObjectConfig } from './models/scene-object-config';
import { waitTime } from './helpers/timer-helper';
import { ObjectManager } from './managers/object.manager';


@Component({
  selector: 'ar-ml',
  templateUrl: './ar-ml.component.html',
  styleUrls: ['./ar-ml.component.css']
})
export class ArMlComponent implements OnInit {

  @ViewChild(SceneObjectDirective, { static: true }) private sceneObjectHost: SceneObjectDirective;
  @ViewChild("container", { static: true }) private container: ElementRef;
  @ViewChild("videoElement", { static: true }) private video: ElementRef;

  @Output() onError: EventEmitter<string> = new EventEmitter();
  @Output() onSceneReady: EventEmitter<ObjectManager> = new EventEmitter<ObjectManager>();

  deviceReady: any;

  private objectManger: ObjectManager;

  constructor(
    private cameraService: CameraService,
    private sceneService: SceneService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.objectManger = new ObjectManager(this.sceneService, this.componentFactoryResolver, this.sceneObjectHost);
  }

  ngAfterViewInit() {
    this.cameraService.loadFromUserCamera()
      .catch(error => {
        this.onError.emit(error);
        this.deviceReady = false;
      })
      .then(result => {
        if (result) {
          this.video.nativeElement.srcObject = result;
          (<HTMLVideoElement>this.video.nativeElement).play();
          this.deviceReady = true;
        }
      });

    (<HTMLVideoElement>this.video.nativeElement).addEventListener("play", x => {
      this.startScene();
    })
  }

  public addSceneObject(component: Type<any>, sceneObjectConfig: SceneObjectConfig) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = this.sceneObjectHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent(componentFactory);
    //(<SceneObjectComponent>componentRef.instance).data = result.data;

    this.sceneService.addUIElement(componentRef.location, sceneObjectConfig);
  }

  private async startScene() {

    await waitTime(1000);

    const video: HTMLVideoElement = this.video.nativeElement;

    if(this.sceneService.createScene(this.container, video.clientWidth, video.clientHeight)){
      this.sceneService.AddSampleBoxToScene();
      this.onSceneReady.emit(this.objectManger);
      this.sceneService.update();
    }else{
      this.onError.emit("Could not create scene");
    }
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: any, targetElement: HTMLElement): void {
    const video: HTMLVideoElement = this.video.nativeElement;
    let x = (event.layerX / video.clientWidth) * 2 - 1;
    let y = - (event.layerY / video.clientHeight) * 2 + 1;
    this.sceneService.launchRay(x, y);
  }

}
