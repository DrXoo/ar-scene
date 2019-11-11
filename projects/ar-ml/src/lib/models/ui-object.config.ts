import { ElementRef } from '@angular/core';
import { UIObject } from 'ar-ml/lib/models/uiObject';

export enum PositionType{
    ABSOLUTE,
    RELATIVE
}

export enum AnchorType{
    LEFT,
    TOP,
    RIGHT, 
    BOTTOM,
    TOPLEFT,
    TOPRIGHT,
    BOTTOMLEFT,
    BOTTOMRIGHT,
    CENTER
}

export class UIObjectConfig{
    private container: ElementRef;

    constructor(container: ElementRef){
        this.container = container;
    }

    public setPosition(uiObject: UIObject, positionType: PositionType, anchorType: AnchorType) : void {
        if(positionType == PositionType.ABSOLUTE){
            this.setAbsolutePosition(uiObject, anchorType);
        }
    }

    public setAbsolutePosition(uiObject: UIObject, anchorType: AnchorType) : void{
        switch(anchorType){
            case AnchorType.LEFT:
                uiObject.cssObjectPosition().set(this.containerWidth(),0,0);
                uiObject.position.set(-this.containerWidth(),0,0);
                break;
            case AnchorType.RIGHT:
                uiObject.cssObjectPosition().set(-this.containerWidth(),0,0);
                uiObject.position.set(+this.containerWidth(),0,0);
                break;
            case AnchorType.CENTER:
                uiObject.cssObjectPosition().set(0,0,0);
                uiObject.position.set(0,0,0);
                break;
        }
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