import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { SceneConfig } from './scene.config';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

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
        
  
        

        if(this.scene.children[0].rotation.y >= Math.PI * 80 / 180.0){
            this.scene.children[0].rotation.y -= 0.01;
        }else if(this.scene.children[0].rotation.y <= Math.PI * 5 / 180.0){
            this.scene.children[0].rotation.y += 0.01;
        }

        let pepa =  <CSS3DObject>this.scene.children[0].children[0];
        // console.log(pepa.element.children[0].clientWidth);
        console.log(  (180 / Math.PI) * this.scene.children[0].rotation.y);
        //this.scene.children[0].rotateY(0.02);

        // this.updateCanvasSize();

        // this.camera.aspect = this.config.width / this.config.height;
        this.config.renderer.render(this.scene, camera);
        camera.updateProjectionMatrix();
    }
}