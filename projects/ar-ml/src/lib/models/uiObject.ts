import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Group, Vector3, Vector2 } from 'three';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';
import { UIPositionHelper } from '../helpers/ui-position.helper';
import { SceneObjectConfig } from './scene-object-config';

export class UIObject extends Group{

    private readonly GENERIC_USER_INTERACTION_DIV_ID: string = ""

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
        sceneObjectConfig: SceneObjectConfig){
        super();
        
        this.sceneSize = sceneSize;
        this.positionType = sceneObjectConfig.position;
        this.anchorType = sceneObjectConfig.anchor;
        this.cssObject = new CSS3DObject(element);
        
        this.add(this.cssObject);

        this.updateDelegate = sceneObjectConfig.updateDelegate;
    }

    public update(){
        let cssObjectSize = new Vector2(this.cssObject.element.clientWidth, this.cssObject.element.clientHeight);
        UIPositionHelper.setPosition(this.position, this.cssObject.position, this.sceneSize, cssObjectSize, this.positionType, this.anchorType);

        this.updateDelegate(this);
    }

    public getUserElement() : HTMLElement{
        return this.cssObject.element;
    }
}