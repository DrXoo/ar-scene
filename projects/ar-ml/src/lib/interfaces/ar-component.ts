import { UIObject } from '../models/uiObject';
import { ObjectNotificationService } from '../services/object-notification.service';

export interface ArComponent {
    uiObject: UIObject;
    className: string;
    objectNotificationService: ObjectNotificationService;
}