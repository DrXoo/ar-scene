import { SceneService, SceneObjectConfig } from '../../public-api';
import { ComponentFactoryResolver, Type } from '@angular/core';
import { SceneObjectDirective } from '../directives/scene-object.directive';
import { SceneObjectComponent } from '../interfaces/scene-object-component'

export class ObjectManager {

  private objects: string[] = []

  constructor(private sceneService: SceneService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sceneObjectHost: SceneObjectDirective
  ) {

  }

  public addUIObject(component: Type<any>, sceneObjectConfig: SceneObjectConfig) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = this.sceneObjectHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent(componentFactory);


    let objectId = this.sceneService.addUIElement(componentRef.location, sceneObjectConfig);

    (<SceneObjectComponent>componentRef.instance).id = objectId;

    this.objects.push(objectId);
  }

  public removeUIObject(id: string) {
    if (this.sceneService.removeUIElement(id)) {
      this.removeObject(id);
    }
  }

  private removeObject(id: string) {
    const index = this.objects.indexOf(id);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

}