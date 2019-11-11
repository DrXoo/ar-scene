import { OnInit, Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: 'lib-ar-ui-directive'
})
export class ArUiDirectiveComponent implements OnInit {

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

}
