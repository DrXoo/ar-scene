import { Scene, Mesh } from 'three';
import { SceneConfig } from './scene.config';
import { UIObject } from './uiObject';

export class SceneInstance {

    public config: SceneConfig;

    public scene: Scene;

    constructor(config: SceneConfig) {
        this.config = config;
        this.scene = new Scene();
        this.config.renderer.setSize(this.config.width, this.config.height);
    }

    public AddToScene( object: any){
        this.scene.add(object);
    }

    public RemoveFromScene( id:string) : boolean{
        let object = this.scene.children.find(x => x.uuid == id);
        
        if(object != undefined){
            this.scene.remove(object);
            return true;
        }
        return false;
    }

    public update() {
  
        this.scene.children
            .filter(x => x instanceof UIObject)
            .forEach(x => (<UIObject>x).update())

        this.scene.children
            .filter(x => x instanceof Mesh)
            .forEach(x => {
                x.rotation.x += 0.01;
                x.rotation.y += 0.02;
            })

        this.config.renderer.render(this.scene, this.config.camera);
        this.config.camera.updateProjectionMatrix();
    }
}