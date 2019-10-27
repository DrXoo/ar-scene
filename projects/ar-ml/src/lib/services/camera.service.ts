import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(){}

  public loadFromUserCamera() : Promise<MediaStream>{
    return navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: "environment"}});
  }

}
