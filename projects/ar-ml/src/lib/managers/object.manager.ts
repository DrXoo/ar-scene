import { SceneService, SceneObjectConfig } from '../../public-api';
import { ComponentFactoryResolver, Type, Injector } from '@angular/core';
import { SceneObjectDirective } from '../directives/scene-object.directive';
import { SceneObjectComponent } from '../interfaces/scene-object-component'
import { ArBaseComponent } from '../components/ar-base/ar-base.component';

export class ObjectManager {

  private objects: string[] = []

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

    const wrapperRef = viewContainerRef.createComponent(baseFactory, undefined, undefined, [[componentRef.location.nativeElement]] );

    (<HTMLElement>wrapperRef.location.nativeElement).style.cssText = sceneObjectConfig.cssText;

    let object = this.sceneService.addUIElement(wrapperRef.location, sceneObjectConfig);

    (<SceneObjectComponent>componentRef.instance).uiObject = object;

    this.objects.push(object.uuid);
  }

  public removeUIObject(id: string) {
    if (this.sceneService.removeUIElement(id)) {
      this.removeObject(id);
    }
  }

  public toggleAnimation(id: string){
    
  }

  private removeObject(id: string) {
    const index = this.objects.indexOf(id);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

}