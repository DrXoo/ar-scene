import { Type } from '@angular/core';
import { PositionType } from '../enums/position-enum';
import { AnchorType } from '../enums/anchor-enum';

export class SceneObjectConfig {
    constructor(public component: Type<any>, public position : PositionType, public anchor : AnchorType, public data: any) {}
}