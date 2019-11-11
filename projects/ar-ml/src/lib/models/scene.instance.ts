import { PerspectiveCamera, Scene } from 'three';
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

    public update(camera: PerspectiveCamera) {
  
        this.scene.children
            .filter(x => x instanceof UIObject)
            .forEach(x => (<UIObject>x).update())


        this.config.renderer.render(this.scene, camera);
        camera.updateProjectionMatrix();
    }
}