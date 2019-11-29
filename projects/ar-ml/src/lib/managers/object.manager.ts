import { ComponentFactoryResolver, ElementRef, Type } from '@angular/core';
import { CircleGeometry, Color, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import { ArBaseComponent } from '../components/ar-base/ar-base.component';
import { SceneObjectDirective } from '../directives/scene-object.directive';
import { PositionType } from '../enums/position-enum';
import { ScreenToWorldPoint } from '../helpers/vector-helper';
import { ArComponent } from '../interfaces/ar-component';
import { ArPointer } from '../models/ar-pointer';
import { ArTrackConfig } from '../models/ar-track.config';
import { SceneService } from '../services/scene.service';
import { ArUIConfig } from '../models/at-ui-config';
import { UIObject } from '../models/uiObject';
import { ObjectNotificationService } from '../services/object-notification.service';

export class ObjectManager {

  readonly DEFAULT_CIRCLE_RADIUS = 0.025;
  readonly DEFAULT_TRACKING_THREESHOLD = 0.15;
  readonly DEFAULT_UI_TRACKING_THREESHOLD_PERCENTAGE = 0.1;

  private objects: string[] = [];

  constructor(private sceneService: SceneService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sceneObjectHost: SceneObjectDirective,
    private objectNotificationService: ObjectNotificationService
  ) {

  }

  public addUIObject(component: Type<any>, sceneObjectConfig: ArUIConfig) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const baseFactory = this.componentFactoryResolver.resolveComponentFactory(ArBaseComponent);

    const viewContainerRef = this.sceneObjectHost.viewContainerRef;

    const componentRef = componentFactory.create(viewContainerRef.injector);

    const wrapperRef = viewContainerRef.createComponent(baseFactory, undefined, undefined, [[componentRef.location.nativeElement]]);

    (<HTMLElement>wrapperRef.location.nativeElement).style.cssText = sceneObjectConfig.cssText;

    let object = this.addUIElement(wrapperRef.location, sceneObjectConfig);

    (<ArComponent>componentRef.instance).uiObject = object;
    (<ArComponent>componentRef.instance).objectNotificationService = this.objectNotificationService;
    (<ArComponent>componentRef.instance).className = sceneObjectConfig.key;

    this.objects.push(object.uuid);
  }

  public manageUIObjects(component: Type<any>, config: ArTrackConfig) {
    let screenPosition = new Vector3(config.x, -config.y, 0);


    let changedPosition = false;

    for (let i = 0; i < this.sceneService.getUIScene().getUIObjects().filter(x => x.key == config.key).length; i++) {
      let uiObject = this.sceneService.getUIScene().getUIObjects()[i];
      if (uiObject.getMinDistanceToPosition(screenPosition) < this.DEFAULT_UI_TRACKING_THREESHOLD_PERCENTAGE * config.width) {
        uiObject.setPositionFromScreen(screenPosition.x, screenPosition.y);
        changedPosition = true;
        break;
      }
    }

    this.sceneService.getUIScene().getUIObjects().forEach(x => x.addPositionToHistoric());

    if (!changedPosition) {
      this.addUIObject(component, <ArUIConfig>{ key: config.key, positionType: PositionType.RELATIVE, position: screenPosition, cssText: "width: 40%;" })
    }
  }

  public manageArPointers(config: ArTrackConfig) {
    let clampedPosition = ScreenToWorldPoint(config.x, config.y, config.width, config.height);
    let auxVector = this.getUnprojectVector(clampedPosition);

    let changedPosition = false;

    for (let i = 0; i < this.sceneService.getObjectScene().getMeshObjects().filter(x => x.key == config.key).length; i++) {
      let meshObject = this.sceneService.getObjectScene().getMeshObjects()[i];
      if (meshObject.getMinDistanceToPosition(auxVector) < this.DEFAULT_TRACKING_THREESHOLD) {
        meshObject.setPosition(auxVector);
        changedPosition = true;
        break;
      }
    }

    this.sceneService.getObjectScene().getMeshObjects().forEach(x => x.addPositionToHistoric());

    if (!changedPosition) {
      this.addArPointer(config.key, clampedPosition);
    }
  }

  public removeUIObject(id: string) {
    if (this.removeFromUIScene(id)) {
      this.removeObject(id);
    }
  }

  public removeMeshObject(id: string) {
    if (this.removeFromObjectScene(id)) {
      this.removeObject(id);
    }
  }

  private addArPointer(key: string, position: Vector3, radius: number = this.DEFAULT_CIRCLE_RADIUS, color: Color = new Color(0, 1, 0)) {
    let geometry = new CircleGeometry(radius, 32);

    let material = new MeshBasicMaterial({ color: color });

    let mesh = new ArPointer(key, geometry, material, this)

    position = position.unproject(this.sceneService.getObjectScene().camera);

    mesh.position.set(position.x, position.y, position.z);

    this.sceneService.getObjectScene().addToScene(mesh);
  }

  private addUIElement(element: ElementRef, arUIConfig: ArUIConfig): UIObject {

    let uiObject = new UIObject(arUIConfig.key,
      element.nativeElement,
      new Vector2(this.sceneService.getUIScene().width, this.sceneService.getUIScene().height),
      arUIConfig,
      this
    );

    if (arUIConfig.positionType == PositionType.RELATIVE) {
      uiObject.setPositionFromScreen(arUIConfig.position.x, arUIConfig.position.y);
      uiObject.addPositionToHistoric();
    }

    this.sceneService.getUIScene().addToScene(uiObject);

    return uiObject;
  }

  private removeFromUIScene(id: string): boolean {
    const uiObject = <UIObject>this.sceneService.getUIScene().getObjectById(id);
    const removedId = this.sceneService.getUIScene().removeFromScene(id);
    uiObject.getUserElement().parentNode.removeChild(uiObject.getUserElement());
    return removedId;
  }

  private removeFromObjectScene(id: string) {
    const removedId = this.sceneService.getObjectScene().removeFromScene(id);
    return removedId;
  }

  private removeObject(id: string) {
    const index = this.objects.indexOf(id);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  private getUnprojectVector(clampedPosition: Vector3): Vector3 {
    let result = new Vector3(clampedPosition.x, clampedPosition.y, clampedPosition.z);

    return result.unproject(this.sceneService.getObjectScene().camera);
  }

}