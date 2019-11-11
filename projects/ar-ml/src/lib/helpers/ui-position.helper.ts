import { UIObject } from 'ar-ml/lib/models/uiObject';
import { PositionType, AnchorType } from '../models/ui-object.config';

export class UIPositionHelper{
    public static setPosition(uiObject: UIObject, positionType: PositionType, anchorType: AnchorType) : void {
        if(positionType == PositionType.ABSOLUTE){
            this.setAbsolutePosition(uiObject, anchorType);
        }
    }

    private static setAbsolutePosition(uiObject: UIObject, anchorType: AnchorType) : void{
        switch(anchorType){
            case AnchorType.LEFT:
                uiObject.cssObjectPosition().set(uiObject.containerWidth(),0,0);
                uiObject.position.set(-uiObject.containerWidth(),0,0);
                break;
            case AnchorType.RIGHT:
                uiObject.cssObjectPosition().set(-uiObject.containerWidth(),0,0);
                uiObject.position.set(+uiObject.containerWidth(),0,0);
                break;
            case AnchorType.CENTER:
                uiObject.cssObjectPosition().set(0,0,0);
                uiObject.position.set(0,0,0);
                break;
        }
    }
}