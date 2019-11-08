import { SceneInstance } from './scene.instance';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class Object3D {
    object : any;

    public updateDelegate : () => void;

    constructor(delegate :() => void){
        this.updateDelegate = delegate;
    }

    public update(){
        this.updateDelegate();
    }

}