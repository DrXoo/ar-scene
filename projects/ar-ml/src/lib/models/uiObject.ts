import { Group, Vector2, Vector3 } from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { AnchorType } from '../enums/anchor-enum';
import { PositionType } from '../enums/position-enum';
import { UIPositionHelper } from '../helpers/ui-position.helper';
import { ArUIConfig } from './scene-object-config';
import { ObjectManager } from '../managers/object.manager';

export class UIObject extends Group {

    readonly N_PREVIOUS_FRAMES_LENGHT = 8;
    readonly MILISECONDS_NOT_RECOGNIZE_TO_DIE = 2000;

    private historicPositions: Vector3[] = [];
    private historicIndex: number = 0;
    private lastTimeDetected: Date = new Date();

    private sceneSize: Vector2;
    private cssObject: CSS3DObject;
    private updateDelegate: (object: UIObject) => void;
    private positionType: PositionType;
    private anchorType: AnchorType;
    key: string;

    public cssObjectPosition(): Vector3 {
        return this.cssObject.position;
    }

    constructor(
        key: string,
        element: HTMLElement,
        sceneSize: Vector2,
        arUIConfig: ArUIConfig,
        private objectManager: ObjectManager) {
        super();

        this.key = key;
        this.sceneSize = sceneSize;

        this.positionType = arUIConfig.positionType;
        this.anchorType = arUIConfig.anchorType;
        this.cssObject = new CSS3DObject(element);

        this.add(this.cssObject);

        this.updateDelegate = arUIConfig.updateDelegate;
    }

    public update() {
        if (this.positionType == PositionType.ABSOLUTE) {
            let cssObjectSize = new Vector2(this.cssObject.element.clientWidth, this.cssObject.element.clientHeight);
            UIPositionHelper.setPosition(this.position, this.cssObject.position, this.sceneSize, cssObjectSize, this.positionType, this.anchorType);

            this.updateDelegate(this);
        } else {
            if ((new Date()).getTime() - this.lastTimeDetected.getTime() >= this.MILISECONDS_NOT_RECOGNIZE_TO_DIE) {
                this.objectManager.removeUIObject(this.uuid);
            }
        }
    }

    public setPositionFromScreen(screenX: number, screenY: number) {
        let convertedPosition: { x, y } = this.getCorrectPositionFromScreen(screenX, screenY);

        this.position.set(convertedPosition.x, convertedPosition.y, this.position.z);
        this.lastTimeDetected = new Date();
    }

    public getMinDistanceToPosition(position: Vector3): number {
        let convertedPosition = this.getCorrectVectorFromScreen(position);

        let distances = this.historicPositions.map(x => x.distanceTo(convertedPosition));
        return Math.min(...distances);
    }


    public addPositionToHistoric() {
        let copyPosition = new Vector3(this.position.x, this.position.y, this.position.z);

        this.historicPositions[this.historicIndex] = copyPosition;
        this.historicIndex++;

        if (this.historicIndex >= this.N_PREVIOUS_FRAMES_LENGHT) {
            this.historicIndex = 0;
        }
    }


    public getUserElement(): HTMLElement {
        return this.cssObject.element;
    }


    private getCorrectVectorFromScreen(position: Vector3): Vector3 {
        let x = (((position.x / this.sceneSize.x) * 2) - 1) * (this.sceneSize.x / 2);
        let y = (((position.y / -this.sceneSize.y) * 2) - 1) * (-this.sceneSize.y / 2);

        return new Vector3(x,y,0);
    }

    private getCorrectPositionFromScreen(screenX:number, screenY:number): { x: Number, y: number } {
        let x = (((screenX / this.sceneSize.x) * 2) - 1) * (this.sceneSize.x / 2);
        let y = (((screenY / -this.sceneSize.y) * 2) - 1) * (-this.sceneSize.y / 2);

        return { x, y }
    }
}