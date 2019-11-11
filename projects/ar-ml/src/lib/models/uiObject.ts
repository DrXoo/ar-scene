import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Group, Vector3, Vector2 } from 'three';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';
import { UIPositionHelper } from '../helpers/ui-position.helper';

export class UIObject extends Group{

    private sceneSize: Vector2;
    private cssObject: CSS3DObject;
    private updateDelegate : (object : UIObject) => void;
    private positionType: PositionType;
    private anchorType: AnchorType;

    public cssObjectPosition() : Vector3 {
        return this.cssObject.position;
    }

    constructor(element : HTMLElement,
        sceneSize: Vector2,
        positionType: PositionType,
        anchorType: AnchorType,
        updateDelegate : (object : UIObject) => void){
        super();

        this.sceneSize = sceneSize;
        this.positionType = positionType;
        this.anchorType = anchorType;
        this.cssObject = new CSS3DObject(element);
        
        this.add(this.cssObject);

        this.updateDelegate = updateDelegate;
    }

    public update(){
        let cssObjectSize = new Vector2(this.cssObject.element.clientWidth, this.cssObject.element.clientHeight);
        UIPositionHelper.setPosition(this.position, this.cssObject.position, this.sceneSize, cssObjectSize, this.positionType, this.anchorType);
        this.updateDelegate(this);
    }
}