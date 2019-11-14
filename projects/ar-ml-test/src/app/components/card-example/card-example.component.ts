import { Component, OnInit } from '@angular/core';
import { SceneObjectComponent } from 'ar-ml/lib/interfaces/scene-object-component'

@Component({
  selector: 'card-example',
  templateUrl: './card-example.component.html',
  styleUrls: ['./card-example.component.scss']
})
export class CardExampleComponent implements OnInit, SceneObjectComponent {
  data: any;

  constructor() { }

  ngOnInit() {
  }

}
