import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Group, Vector3 } from 'three';
import { ElementRef } from '@angular/core';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';
import { UIPositionHelper } from '../helpers/ui-position.helper';

export class UIObject extends Group{

    private container: ElementRef;
    private cssObject: CSS3DObject;
    private updateDelegate : (object : UIObject) => void;

    public cssObjectPosition() : Vector3 {
        return this.cssObject.position;
    }

    constructor(element : HTMLElement,
        positionType: PositionType,
        anchorType: AnchorType,
        updateDelegate : (object : UIObject) => void){
        super();

        this.cssObject = new CSS3DObject(element);
        
        this.add(this.cssObject);

        UIPositionHelper.setPosition(this.position, this.cssObject.position, null, positionType, anchorType);

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