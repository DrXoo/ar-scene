import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { SceneConfig } from './scene.config';

export class SceneInstance {

    public config: SceneConfig;

    public scene: Scene;

    constructor(config: SceneConfig) {
        this.config = config;

        // this.updateCanvasSize();

        this.scene = new Scene();
        this.config.renderer.setSize(this.config.width, this.config.height);
    }

    public AddToScene( object: any){
        this.scene.add(object);
    }

    public update(camera: PerspectiveCamera) {
        
  
        // this.scene.children[0].rotation.x += 0.01;
        // this.scene.children[0].rotation.y += 0.02;

        // this.updateCanvasSize();

        // this.camera.aspect = this.config.width / this.config.height;
        this.config.renderer.render(this.scene, camera);
        camera.updateProjectionMatrix();
    }

    // private updateCanvasSize() {
    //     this.config.canvas.width = this.config.width;
    //     this.config.canvas.height = this.config.height;
    // }
}