import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SceneObjectDirective } from './directives/scene-object.directive';
import { waitTime } from './helpers/timer-helper';
import { ObjectManager } from './managers/object.manager';
import { CameraService } from './services/camera.service';
import { SceneService } from './services/scene.service';


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
  @Output() onSceneReady: EventEmitter<any> = new EventEmitter<any>();

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

  private async startScene() {

    await waitTime(1000);

    const video: HTMLVideoElement = this.video.nativeElement;

    this.sceneService.createScene(this.container, video.clientWidth, video.clientHeight)
      .subscribe(
        result => {
          if (result) {
            this.onSceneReady.emit({ ObjectManager: this.objectManger, Video: video });
          }
        },
        error => {
          this.onError.emit(error);
        });
  }
}
