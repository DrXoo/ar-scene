import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';
import { UIObject } from './uiObject';

export class SceneObjectConfig {
    constructor(public position : PositionType, public anchor : AnchorType, public updateDelegate : (object : UIObject) => void) {}
}