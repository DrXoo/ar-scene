import { Component, OnInit } from '@angular/core';
import { ObjectNotificationService } from 'projects/ar-ml/src/lib/services/object-notification.service';
import { ArComponent } from 'projects/ar-ml/src/lib/interfaces/ar-component';
import { UIObject } from 'projects/ar-ml/src/lib/models/uiObject';
@Component({
  selector: 'card-example',
  templateUrl: './card-example.component.html',
  styleUrls: ['./card-example.component.scss']
})
export class CardExampleComponent implements OnInit, ArComponent {
  uiObject: UIObject;

  className: string;


  constructor(private objectNotificationService : ObjectNotificationService) { }

  ngOnInit() {
  }

  close(){
    this.objectNotificationService.onRemoveObject.emit(this.uiObject.uuid);
  }

  ngAfterViewInit(){
  }

  testEvent(){
    this.className = this.uiObject.key;
  }
}
