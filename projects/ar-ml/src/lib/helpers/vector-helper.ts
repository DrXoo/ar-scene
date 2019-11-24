import { Camera, Vector3 } from 'three';

export function ScreenToWorldPoint(screenX: number, screenY: number, width: number, height: number) : Vector3{
    let x = (screenX / width) * 2 - 1;
    let y = - (screenY / height) * 2 + 1;
    let vector = new Vector3(x,y,-1);
    return vector;
}