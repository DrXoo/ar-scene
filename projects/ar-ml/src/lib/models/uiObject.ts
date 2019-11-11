import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Group, Vector3 } from 'three';
import { UIObjectConfig, PositionType, AnchorType } from './ui-object.config';
import { ElementRef } from '@angular/core';

export class UIObject extends Group{

    private container: ElementRef;
    private cssObject: CSS3DObject;
    private config: UIObjectConfig;
    private updateDelegate : (object : UIObject) => void;

    public cssObjectPosition() : Vector3 {
        return this.cssObject.position;
    }

    constructor(element : HTMLElement,
        positionType: PositionType,
        anchorType: AnchorType,
        pivotPosition : Vector3,
        uiElementPosition: Vector3,
        updateDelegate : (object : UIObject) => void){
        super();

        this.config
        this.cssObject = new CSS3DObject(element);
        
        this.add(this.cssObject);
        this.position.set(pivotPosition.x, pivotPosition.y, pivotPosition.z);
        this.cssObject.position.set(uiElementPosition.x, uiElementPosition.y, uiElementPosition.z);

        this.updateDelegate = updateDelegate;
    }

    public update(){
        this.updateDelegate(this);
    }

    public containerWidth() : number{
        if(this.container.nativeElement.clientWidth != undefined){
            return this.container.nativeElement.clientWidth;
        }
        if(this.container.nativeElement.offsetWidth != undefined){
            return this.container.nativeElement.offsetWidth;
        }
    }

    public containerHeight() : number{
        if(this.container.nativeElement.clientHeight != undefined){
            return this.container.nativeElement.clientHeight;
        }
        if(this.container.nativeElement.offsetHeight != undefined){
            return this.container.nativeElement.offsetHeight;
        }
    }
}