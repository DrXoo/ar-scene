import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectNotificationService {

  public onRemoveObject: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
}
