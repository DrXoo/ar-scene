import { Vector3, Vector2 } from 'three';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';

export class UIPositionHelper {

    public static setPosition(pivot : Vector3, position : Vector3, containerSize: Vector2, positionType: PositionType, anchorType: AnchorType) : void {
        if(positionType == PositionType.ABSOLUTE){
            this.setAbsolutePosition(pivot, position, containerSize, anchorType);
        }
    }

    private static setAbsolutePosition(pivot : Vector3,
             position : Vector3, 
             containerSize: Vector2,
             anchorType: AnchorType) : void{
        switch(anchorType){
            case AnchorType.LEFT:
                position.set(containerSize.x,0,0);
                pivot.set(-containerSize.x,0,0);
                break;
            case AnchorType.RIGHT:
                position.set(-containerSize.x,0,0);
                pivot.set(+containerSize.x,0,0);
                break;
            case AnchorType.CENTER:
                position.set(0,0,0);
                pivot.set(0,0,0);
                break;
            default:
                console.log("Position not implemented: "+anchorType);
                position.set(0,0,0);
                pivot.set(0,0,0);
                break;
        }
    }
}