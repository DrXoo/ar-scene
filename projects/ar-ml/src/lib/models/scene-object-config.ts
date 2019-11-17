import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';
import { UIObject } from './uiObject';

export class SceneObjectConfig {
    public position : PositionType;
    public anchor : AnchorType;
    public updateDelegate : (object : UIObject) => void;    
    public cssText? : string;
}