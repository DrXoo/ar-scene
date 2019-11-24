import { ComponentFactoryResolver, ElementRef, Type } from '@angular/core';
import { CircleGeometry, Color, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import { SceneObjectConfig, SceneService, UIObject } from '../../public-api';
import { ArBaseComponent } from '../components/ar-base/ar-base.component';
import { SceneObjectDirective } from '../directives/scene-object.directive';
import { ScreenToWorldPoint } from '../helpers/vector-helper';
import { SceneObjectComponent } from '../interfaces/scene-object-component';
import { ArPointer } from '../models/ar-pointer';

export class ObjectManager {

  readonly DEFAULT_CIRCLE_RADIUS = 0.025;
  readonly DEFAULT_TRACKING_THREESHOLD = 0.15;

  private objects: string[] = [];

  constructor(private sceneService: SceneService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sceneObjectHost: SceneObjectDirective
  ) {

  }

  public addUIObject(component: Type<any>, sceneObjectConfig: SceneObjectConfig) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const baseFactory = this.componentFactoryResolver.resolveComponentFactory(ArBaseComponent);

    const viewContainerRef = this.sceneObjectHost.viewContainerRef;

    const componentRef = componentFactory.create(viewContainerRef.injector);

    const wrapperRef = viewContainerRef.createComponent(baseFactory, undefined, undefined, [[componentRef.location.nativeElement]]);

    (<HTMLElement>wrapperRef.location.nativeElement).style.cssText = sceneObjectConfig.cssText;

    let object = this.addUIElement(wrapperRef.location, sceneObjectConfig);

    (<SceneObjectComponent>componentRef.instance).uiObject = object;

    this.objects.push(object.uuid);
  }

  public manageArPointers(key: string, x: number, y: number, width: number, height: number) {
    let pos = ScreenToWorldPoint(x, y, width, height);

    let auxVector = new Vector3(pos.x, pos.y, pos.z);

    auxVector.unproject(this.sceneService.getObjectScene().camera);

    let changedPosition = false;

    for (let i = 0; i < this.sceneService.getObjectScene().getMeshObjects().filter(x => x.key == key).length; i++) {
      if (this.sceneService.getObjectScene().getMeshObjects()[i].getMinDistanceToPosition(auxVector) < this.DEFAULT_TRACKING_THREESHOLD) {
        this.sceneService.getObjectScene().getMeshObjects()[i].position.set(auxVector.x, auxVector.y, auxVector.z);
        changedPosition = true;
        break;
      }
    }

    this.sceneService.getObjectScene().getMeshObjects().forEach(x => x.addPositionToHistoric());

    if (!changedPosition) {
      this.addArPointer(key, pos);
      console.log(this.sceneService.getObjectScene().getMeshObjects().length);
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

  private addUIElement(element: ElementRef, sceneObjectConfig: SceneObjectConfig): UIObject {

    let uiObject = new UIObject(
      element.nativeElement,
      new Vector2(this.sceneService.getUIScene().width, this.sceneService.getUIScene().height),
      sceneObjectConfig
    );

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

}