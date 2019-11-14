import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[SceneObject]'
})
export class SceneObjectDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
