import { Component, OnInit } from '@angular/core';
import { SceneObjectComponent } from 'projects/ar-ml/src/public-api';

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
