import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Group, Vector3 } from 'three';

export class UIObject extends Group{

    private cssObject: CSS3DObject;
    private updateDelegate : (object : UIObject) => void;

    constructor(element : HTMLElement, 
        pivotPosition : Vector3,
        uiElementPosition: Vector3,
        updateDelegate : (object : UIObject) => void){
        super();

        this.cssObject = new CSS3DObject(element);
        
        this.add(this.cssObject);
        this.position.set(pivotPosition.x, pivotPosition.y, pivotPosition.z);
        this.cssObject.position.set(uiElementPosition.x, uiElementPosition.y, uiElementPosition.z);

        this.updateDelegate = updateDelegate;
    }

    public update(){
        this.updateDelegate(this);
    }
}