import { Component, OnInit } from '@angular/core';
import { SceneObjectComponent } from 'ar-ml/lib/interfaces/scene-object-component'
import { ObjectNotificationService } from 'projects/ar-ml/src/lib/services/object-notification.service';

@Component({
  selector: 'card-example',
  templateUrl: './card-example.component.html',
  styleUrls: ['./card-example.component.scss']
})
export class CardExampleComponent implements OnInit, SceneObjectComponent {
  id: string;

  constructor(private objectNotificationService : ObjectNotificationService) { }

  ngOnInit() {
  }

  close(){
    this.objectNotificationService.onRemoveObject.emit(this.id);
  }
}
