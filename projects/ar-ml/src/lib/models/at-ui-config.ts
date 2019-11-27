import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';
import { UIObject } from './uiObject';
import { Vector3 } from 'three';

export class ArUIConfig {
    public positionType : PositionType;
    public anchorType : AnchorType;
    public updateDelegate : (object : UIObject) => void;    
    public cssText? : string;
    public position? : Vector3;
    public key: string;
}