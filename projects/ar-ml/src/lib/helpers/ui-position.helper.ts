import { Vector3, Vector2 } from 'three';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';

export class UIPositionHelper {

    public static setPosition(pivot : Vector3, 
            position : Vector3, 
            containerSize: Vector2, 
            uiObjectSize: Vector2,
            positionType: PositionType, 
            anchorType: AnchorType) : void {
        if(positionType == PositionType.ABSOLUTE){
            this.setAbsolutePosition(pivot, position, containerSize, uiObjectSize, anchorType);
        }else{

        }
    }

    private static setAbsolutePosition(pivot : Vector3,
             position : Vector3, 
             containerSize: Vector2,
             uiObjectSize: Vector2,
             anchorType: AnchorType) : void{
        let offsetX = containerSize.x - uiObjectSize.x;
        let offsetY = containerSize.y - uiObjectSize.y;
        switch(anchorType){
            case AnchorType.LEFT:
                position.set(uiObjectSize.x / 2,0,0);
                pivot.set(-uiObjectSize.x / 2 - offsetX / 2,0,0);
                break;
            case AnchorType.RIGHT:
                position.set(-uiObjectSize.x / 2 ,0,0);
                pivot.set(uiObjectSize.x / 2 + offsetX / 2,0,0);
                break;
            case AnchorType.TOPLEFT:
                position.set(uiObjectSize.x / 2, -uiObjectSize.y / 2,0);
                pivot.set(-uiObjectSize.x / 2 - offsetX, uiObjectSize.y / 2,0);
                break;
            case AnchorType.BOTTOMLEFT:
                position.set(containerSize.x / 2, uiObjectSize.y / 2,0);
                pivot.set(-containerSize.x / 2 - offsetX / 2, -containerSize.y / 2 - offsetY / 2,0);
                break;
            case AnchorType.TOPRIGHT:
                position.set(-containerSize.x / 2, -uiObjectSize.y / 2,0);
                pivot.set(containerSize.x / 2 + offsetY / 2, containerSize.y / 2,0);
                break;
            case AnchorType.BOTTOMRIGHT:
                position.set(-containerSize.x / 2, uiObjectSize.y / 2,0);
                pivot.set(containerSize.x / 2, -containerSize.y / 2,0);
                break;
            case AnchorType.CENTER:
                position.set(0,0,0);
                pivot.set(0,0,0);
                break;
            case AnchorType.TOP:
                position.set(0, -uiObjectSize.y / 2,0);
                pivot.set(0,containerSize.y / 2,0);
                break;
            case AnchorType.BOTTOM:
                position.set(0, uiObjectSize.y / 2,0);
                pivot.set(0,-containerSize.y / 2,0);
                break;
            default:
                console.log("Position not implemented: "+anchorType);
                position.set(0,0,0);
                pivot.set(0,0,0);
                break;
        }
    }
}