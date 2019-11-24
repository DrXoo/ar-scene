import { Object3D, PerspectiveCamera, Scene } from 'three';
import { ArPointer } from './ar-pointer';
import { SceneConfig } from './scene.config';
import { UIObject } from './uiObject';

export class SceneInstance {

    camera: PerspectiveCamera;
    renderer: any;
    width: number;
    height: number;  
    scene: Scene;

    constructor(config: SceneConfig) {
        this.camera = config.camera;
        this.renderer = config.renderer;
        this.width = config.width;
        this.height = config.height;
        this.scene = new Scene();

        this.renderer.setSize(this.width, this.height);
    }

    public addToScene( object: any){
        this.scene.add(object);
    }

    public removeFromScene(id:string) : boolean{
        let object = this.getObjectById(id);

        if(object != undefined){
            this.scene.remove(object);
            return true;
        }
        return false;
    }

    public getObjectById(id:string): Object3D{
        return this.scene.children.find(x => x.uuid == id);
    }

    public getUIObjects() : UIObject[]{
        return this.scene.children.filter(x => x instanceof UIObject).map(x => <UIObject>x);
    }

    public getMeshObjects() : ArPointer[]{
        return this.scene.children.filter(x => x instanceof ArPointer).map(x => <ArPointer>x);
    }

    public update() {
  
        this.getUIObjects().forEach(x => x.update());

        this.getMeshObjects().forEach(x => x.update());

        this.renderer.render(this.scene, this.camera);
        this.camera.updateProjectionMatrix();
    }
}