import { SceneService, SceneObjectConfig } from '../../public-api';
import { ComponentFactoryResolver, Type } from '@angular/core';
import { SceneObjectDirective } from '../directives/scene-object.directive';

export class ObjectManager{

    private objects: string[] = []

    constructor(private sceneService: SceneService, 
        private componentFactoryResolver: ComponentFactoryResolver,
        private sceneObjectHost : SceneObjectDirective
        ) { 
    
        }
    
      public addUIObject(component: Type<any>, sceneObjectConfig: SceneObjectConfig) {
    
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    
        const viewContainerRef = this.sceneObjectHost.viewContainerRef;
    
        const componentRef = viewContainerRef.createComponent(componentFactory);
        //(<SceneObjectComponent>componentRef.instance).data = result.data;
    
        let objectId =  this.sceneService.addUIElement(componentRef.location, sceneObjectConfig);

        this.objects.push(objectId);
      }
    
}